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
import { throwing } from "./errors/throwing"
import { findUser } from "./database/user"
import { findToken } from "./database/token"
import mongoose from "mongoose"

dotenv.config()

const app: Express = express()

const port: number = 3501

app.use(express.json())

app.use(cors({origin: "*"}))

const [UserModel, TokenModel]: ModelTypes = dbConnection()

app.post("/api/token", (req: Request, res: Response): Response<ResponseType> => {
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
            const user: Promise<UserDataWithMongoExtrasInterface | null> = findUser(UserModel, userData)
            let id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
            console.log(id)
            // const user: Promise<UserDataWithMongoExtrasInterface | null> = findUser(UserModel, userData).then(result => result)
            if(user){
                user.then(res => res && (() => {id = res._id}))
                console.log(id)
                const userToken: Promise<EncodedTokenWithMongoExtrasInterface | null> = findToken(TokenModel, {
                    userId: id
                })
                // response.message = "You're already authenticated. Try justifying some texts."
                // userToken 
                // ? response.token = userToken.value 
                // : throwing("An error occured while treating your token")
                return res.json(response)
            }
            return res.json(response)
            // else{
            //     await UserModel.insertOne(userData)
            //     console.log(userData)
            //     const insertedUser: UserDataWithMongoExtrasInterface | null = await UserModel.findOne(userData)
            //     console.log(insertedUser)
            //     if(insertedUser) {
            //         const token: string = jwt.sign(userData, (process.env.JWT_SECRET) as Secret)
            //         response.message = "You're a brand new user. A token have been generated for you."
            //         response.token = token
            //         await TokenModel.insertOne({
            //             value: token,
            //             userId: insertedUser._id,
            //             remainingRate: 80000
            //         })
            //         return res.json(response)
            //     }
            //     else{
            //         throwing("An error occured while treating your data")
            //     }
            // }
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