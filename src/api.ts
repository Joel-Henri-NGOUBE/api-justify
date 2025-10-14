import express, { Request, Response, Express } from "express"
import dotenv from "dotenv"
import { dbConnection } from "../database/dbConnection"
import { UserModelType } from "../types/mongoose/models"

dotenv.config()

const app: Express = express()

const port: number = 3501

const UserModel: UserModelType = dbConnection()

// app.get("api/token", (req: Request, res: Response) => {

// })

app.listen(port, () => {
    console.log(`The app is running on port ${port}`)
})