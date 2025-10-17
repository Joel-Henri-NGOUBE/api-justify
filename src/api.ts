import express, { Request, Response, Express } from "express"
import dotenv from "dotenv"
import { dbConnection } from "../database/dbConnection"
import { ModelTypes } from "./mongoose/mongoose"
import cors from "cors"
import { UserDataType, UserDataWithMongoExtrasInterface } from "./user"
import { ResponseType } from "./responses"
import jwt, { Secret } from "jsonwebtoken"
import { EncodedTokenWithMongoExtrasInterface, TokenDataInterface } from "./token"
import { UserModelType } from "./mongoose/models"
import { TextRequestType } from "./text"
import { justify } from "./justification/justify"
import { throwing } from "./errors/throwing"
import { writeJsonResponse } from "./responses"
import { getEpochOfTheLastMomentOfTheDay } from "./date"

dotenv.config()

const app: Express = express()

const port: number = 3501

app.use(express.json())

app.use(cors({origin: "*"}))

const [UserModel, TokenModel]: ModelTypes = dbConnection()
    
const response: ResponseType = {
    status: 200,
    message: ""
}

app.post("/api/justify", async (req: Request, res: Response): Promise<Response<string>> => {
    try {
        const authorization = req.headers.authorization
        if(!authorization){
            const jsonResponse = writeJsonResponse(response, 401, "You do not have any token to permit you to justify your text")
            return res.json(jsonResponse)
        }
        const token: string = authorization.split(" ")[1]
        const { text }: TextRequestType = req.body
        const [justifiedText, usedRate] = justify(text)
        const user = await UserModel.findOne(userData)
        return res.header("Content-Type", "text/plain").send(justifiedText)
    } catch (error) {   
        return res.json({error: (error as Error).message})
    }
}) 

app.post("/api/token", async (req: Request, res: Response): Promise<Response<ResponseType>> => {
    try{
        const { email }: UserDataType = req.body
        if(email){
            const userData: UserDataType = {
                email: email
            }
            const user = await UserModel.findOne(userData)
            if(user){
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
                console.log(userData)
                const insertedUser: UserDataWithMongoExtrasInterface | null = await UserModel.findOne(userData)
                console.log(insertedUser)
                if(insertedUser) {
                    const tokenData: TokenDataInterface = {...userData, exp: getEpochOfTheLastMomentOfTheDay()}
                    const token: string = jwt.sign(tokenData, (process.env.JWT_SECRET) as Secret)
                    response.message = "You're a brand new user. A token have been generated for you."
                    response.token = token
                    await TokenModel.insertOne({
                        value: token,
                        userId: insertedUser._id,
                        remainingRate: 80000
                    })
                    return res.json(response)
                }
                else{
                    throwing("An error occured while treating your data")
                }
            }
        }
        else{
            response.status = 401
            response.message = "Your credentials are not in a valid format"
            return res.status(401)
            .json(response)
            
        }
    }
    catch(error){
        response.status = 500
        response.message = (error as Error).message
        return res.status(500)
        .json(response)
        
    }
})

app.listen(port, () => {
    console.log(`The app is running on port ${port}`)
})