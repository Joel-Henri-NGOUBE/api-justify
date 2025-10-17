import express, { Request, Response, Express } from "express"
import dotenv from "dotenv"
import { ModelTypes } from "./mongoose/mongoose"
import cors from "cors"
import { UserDataType, UserDataWithMongoExtrasInterface } from "./user"
import { ResponseType } from "./responses"
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
import { EncodedTokenWithMongoExtrasInterface } from "./token"
import { TextRequestType } from "./text"
import { writeJsonResponse } from "./utils/responses/jsonResponse"
import { generateToken } from "./utils/token/generate"
import { DAILY_RATE_LIMIT, INTERNAL_SERVER_ERROR_STATUS_CODE, OK_STATUS_CODE, PAYMENT_REQUIRED_STATUS_CODE, SERVER_PORT, UNAUTHORIZED_STATUS_CODE } from "./utils/constants"
import { dbConnection } from "./database/dbConnection"
import { findIfIsAuthorized } from "./middlewares/authorization"
import { justify } from "./utils/justification/justify"
import { throwing } from "./utils/errors/throwing"

dotenv.config()

const app: Express = express()

app.use(express.json())

app.use(cors({origin: "*"}))

const [UserModel, TokenModel]: ModelTypes = dbConnection()
    

app.post("/api/justify", findIfIsAuthorized, async (req: Request, res: Response): Promise<Response<string | ResponseType>> => {
    const response: ResponseType = {
        status: OK_STATUS_CODE,
        message: ""
    }

    try {
        // Retrieve the token of the header treated in the middleware
        const token = res.locals.token as string

        const { text }: TextRequestType = req.body

        // Get the justified text and the number of words used
        const [justifiedText, usedRate] = justify(text)

        // Get the token value to see if it's a good one
        const jwtData: JwtPayload | string = (res.locals.tokenData as JwtPayload | string)

        // Get the requesting user
        const user = await UserModel.findOne({email: (jwtData as UserDataType).email})

        const insertedToken: EncodedTokenWithMongoExtrasInterface | null = await TokenModel.findOne(
            {
                userId: (user as UserDataWithMongoExtrasInterface)._id
            }
        )

        // In case the secret is found
        if(token !== insertedToken?.value){

            return res.status(UNAUTHORIZED_STATUS_CODE)

            .json(writeJsonResponse(response, 
                UNAUTHORIZED_STATUS_CODE, 
                "The token you're using is neither your own nor associated to you"
            ))
        }

        const remainingRate = insertedToken.remainingRate - usedRate

        // To deny further justifications when the rate limit is reached
        if(remainingRate < 0){
            return res.status(PAYMENT_REQUIRED_STATUS_CODE)
            .json(writeJsonResponse(
                response, 
                PAYMENT_REQUIRED_STATUS_CODE, 
                "You've reached the daily limit of text justifications. Get one of our paying offers"
            ))
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
        return res.header("Content-Type", "text/plain")
        .send(justifiedText)
    } catch (error) {   
        return res.json({error: (error as Error).message})
    }
}) 

app.post("/api/token", async (req: Request, res: Response): Promise<Response<ResponseType>> => {
    const response: ResponseType = {
        status: OK_STATUS_CODE,
        message: ""
    }

    try{
        const { email }: UserDataType = req.body
        if(email){
            const userData: UserDataType = {
                email: email
            }

            const user: UserDataWithMongoExtrasInterface | null = await UserModel.findOne(userData)

            if(user){
                // Getting the token of the requesting user
                const userToken: EncodedTokenWithMongoExtrasInterface | null = await TokenModel.findOne({
                    userId: user._id
                })

                if(userToken){
                    let jsonResponse: ResponseType = writeJsonResponse(response, 
                        OK_STATUS_CODE, 
                        "You're already authenticated. Try justifying some texts.", 
                        userToken.value, 
                        userToken.remainingRate
                    )

                    jwt.verify(userToken.value, process.env.JWT_SECRET as Secret, async (error) => {
                        if(error){
                            if(error.name === "TokenExpiredError"){

                                const newToken: string = generateToken(userData)
                                response.token && delete response["token"]

                                jsonResponse = writeJsonResponse(response, 
                                    OK_STATUS_CODE, 
                                    "You're token has expired. A new token have been generated for you", newToken
                                )

                                await TokenModel.updateOne(
                                    {
                                        "_id": userToken._id
                                    },
                                    {
                                        "$set": {
                                            "value": newToken
                                        }
                                    }
                                )
                            }else{
                                jsonResponse = writeJsonResponse(response, 
                                    UNAUTHORIZED_STATUS_CODE, 
                                    error.message)
                                res.status(UNAUTHORIZED_STATUS_CODE)
                            }
                        }
                    })
                    return res.json(jsonResponse)
                }
                else{
                    const jsonResponse: ResponseType = writeJsonResponse(response, 
                        UNAUTHORIZED_STATUS_CODE, 
                        "An error occured while treating your token")

                    throwing("An error occured while treating your token")

                    return res.status(UNAUTHORIZED_STATUS_CODE)
                    .json(jsonResponse)
                }

            }
            else{
                await UserModel.insertOne(userData)

                const insertedUser: UserDataWithMongoExtrasInterface | null = await UserModel.findOne(userData)

                if(insertedUser) {
                    const newToken: string = generateToken(userData)

                    const jsonResponse = writeJsonResponse(response, OK_STATUS_CODE, "You're a brand new user. A token have been generated for you.", newToken)

                    // Insert the token in the database
                    await TokenModel.insertOne({
                        value: newToken,
                        userId: insertedUser._id,
                        remainingRate: DAILY_RATE_LIMIT
                    })

                    return res.json(jsonResponse)
                }
                else{

                    const error = "An error occured while treating your data"
                    throwing(error)

                    return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE)
                    .json(writeJsonResponse(response, INTERNAL_SERVER_ERROR_STATUS_CODE, error))
                }
            }
        }
        else{
            return res.status(UNAUTHORIZED_STATUS_CODE)
            .json(writeJsonResponse(response, UNAUTHORIZED_STATUS_CODE, "Your credentials are not in a valid format"))  
        }
    }
    catch(error){
        return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .json(writeJsonResponse(response, INTERNAL_SERVER_ERROR_STATUS_CODE, (error as Error).message))
        
    }
})

app.listen(SERVER_PORT, () => {
    console.log(`The app is running on port ${SERVER_PORT}`)
})