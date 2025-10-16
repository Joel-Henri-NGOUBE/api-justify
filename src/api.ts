import express, { Request, Response, Express } from "express"
import dotenv from "dotenv"
import { dbConnection } from "../database/dbConnection"
import { ModelTypes } from "./mongoose/mongoose"
import cors from "cors"
import { UserDataType, UserDataWithMongoExtrasInterface } from "./user"
import { ResponseType } from "./responses"
import jwt, { Secret } from "jsonwebtoken"
import { EncodedTokenWithMongoExtrasInterface } from "./token"
import { UserModelType } from "./mongoose/models"
import { TextRequestType } from "./text"
import { justify } from "./justification/justify"

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

app.post("/api/justify", (req: Request, res: Response): Response<ResponseType> => {
    try {
        const { text }: TextRequestType = req.body
        // console.log(text)
        console.log(justify(text))
        return res.json({
            justifiedText: justify(text)
        })
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
                : () => {throw new Error("An error occured while treating your token")}
                return res.json(response)
            }
            else{
                await (UserModel as UserModelType).insertOne(userData)
                console.log(userData)
                const insertedUser: UserDataWithMongoExtrasInterface | null = await UserModel.findOne(userData)
                console.log(insertedUser)
                if(insertedUser) {
                    const token: string = jwt.sign(userData, (process.env.JWT_SECRET) as Secret)
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
                    throw new Error("An error occured while treating your data")
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