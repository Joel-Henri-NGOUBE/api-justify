import mongoose from "mongoose";
import { UserSchemaType } from "../types/mongoose/schemas";
import { UserModelType } from "../types/mongoose/models";

const UserSchema: UserSchemaType = new mongoose.Schema()

export function dbConnection(): UserModelType{
    const dbUri: string = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.xng7q05.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    mongoose.connect(dbUri, {
        dbName: "justify"
    })

    const UserModel: UserModelType = mongoose.model('User', UserSchema)

    return UserModel
}