import express, { Request, Response, Express } from "express"
import dotenv from "dotenv"
import { dbConnection } from "../database/dbConnection"
import { ModelTypes } from "./mongoose/mongoose"
import cors from "cors"
import { UserDataType, UserDataWithMongoExtrasInterface } from "./user"
import { ResponseType } from "./responses"
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
import { EncodedTokenWithMongoExtrasInterface, TokenDataInterface } from "./token"
import { UserModelType } from "./mongoose/models"
import { TextRequestType } from "./text"
import { justify } from "./justification/justify"
import { throwing } from "./errors/throwing"
import { writeJsonResponse } from "./responses/jsonResponse"
import { getEpochOfTheLastMomentOfTheDay } from "./date"
import { findIfIsAuthorized } from "./authorization"

dotenv.config()

const app: Express = express()

const port: number = 3501

app.use(express.json())

app.use(cors({origin: "*"}))

const [UserModel, TokenModel]: ModelTypes = dbConnection()
    

app.post("/api/justify", findIfIsAuthorized, async (req: Request, res: Response): Promise<Response<string | ResponseType>> => {
    const response: ResponseType = {
        status: 200,
        message: ""
    }

    try {
        // In order to retrieve the token
        const authorization = req.headers.authorization
        // Get the token part of the authorization header
        const token: string = (authorization as string).split(" ")[1]
        const { text }: TextRequestType = req.body

        // Get the justified text and the number of words used
        const [justifiedText, usedRate] = justify(text)

        // Get the token value to see if it's a good one
        const jwtData: JwtPayload | string = jwt.verify(token, (process.env.JWT_SECRET as Secret))
        // Get the user
        const user = await UserModel.findOne({email: (jwtData as UserDataType).email})

        const insertedToken: EncodedTokenWithMongoExtrasInterface | null = await TokenModel.findOne({userId: (user as UserDataWithMongoExtrasInterface)._id})

        // In case the secret is found
        if(token !== insertedToken?.value){
            return res.status(401)
            .json(writeJsonResponse(response, 401, "The token you're using is neither your own nor associated to you"))
        }

        const remainingRate = insertedToken.remainingRate - usedRate

        // To deny further justifications when the rate limit is reached
        if(remainingRate < 0){
            return res.status(402)
            .json(writeJsonResponse(response, 402, "You've reached the daily limit of text justifications. Get one of our paying offers"))
        }

        await TokenModel.updateOne(
            {
                "_id": insertedToken._id
            },
            {
                "$set": {
                    "remainingRate": remainingRate
                }
            }
        )
        return res.header("Content-Type", "text/plain").send(justifiedText)
    } catch (error) {   
        return res.json({error: (error as Error).message})
    }
}) 

app.post("/api/token", async (req: Request, res: Response): Promise<Response<ResponseType>> => {
    const response: ResponseType = {
        status: 200,
        message: ""
    }

    try{
        const { email }: UserDataType = req.body
        if(email){
            const userData: UserDataType = {
                email: email
            }

            const user = await UserModel.findOne(userData)

            if(user){
                // Getting the token of the requesting user
                const userToken: EncodedTokenWithMongoExtrasInterface | null = await TokenModel.findOne({
                    userId: user._id
                })

                response.message = "You're already authenticated. Try justifying some texts."

                userToken 
                ? response.token = userToken.value 
                : throwing("An error occured while treating your token")

                return res.json(response)
            }
            else{
                await UserModel.insertOne(userData)

                const insertedUser: UserDataWithMongoExtrasInterface | null = await UserModel.findOne(userData)

                if(insertedUser) {
                    // Setting the data that'll be stored in the token
                    const tokenData: TokenDataInterface = {...userData, exp: getEpochOfTheLastMomentOfTheDay(), iat: Date.now()}

                    const token: string = jwt.sign(tokenData, (process.env.JWT_SECRET) as Secret)

                    const jsonResponse = writeJsonResponse(response, 200, "You're a brand new user. A token have been generated for you.", token)

                    // Insert the token in the database
                    await TokenModel.insertOne({
                        value: token,
                        userId: insertedUser._id,
                        remainingRate: 80000
                    })

                    return res.json(jsonResponse)
                }
                else{

                    const error = "An error occured while treating your data"
                    throwing(error)

                    return res.status(500)
                    .json(writeJsonResponse(response, 500, error))
                }
            }
        }
        else{
            return res.status(401)
            .json(writeJsonResponse(response, 401, "Your credentials are not in a valid format"))  
        }
    }
    catch(error){
        return res.status(500)
        .json(writeJsonResponse(response, 500, (error as Error).message))
        
    }
})

app.listen(port, () => {
    console.log(`The app is running on port ${port}`)
})