import mongoose from "mongoose";
import { TokenSchemaType, UserSchemaType } from "../types/mongoose/schemas";
import { TokenModelType, UserModelType } from "../types/mongoose/models";
import { ModelTypes } from "./mongoose/mongoose";

const UserSchema: UserSchemaType = new mongoose.Schema()

const TokenSchema: TokenSchemaType = new mongoose.Schema()

export function dbConnection(): ModelTypes{
    const dbUri: string = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.xng7q05.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    mongoose.connect(dbUri, {
        dbName: "justify"
    })

    const UserModel: UserModelType = mongoose.model('User', UserSchema)

    const TokenModel: TokenModelType = mongoose.model('Token', TokenSchema)

    return [UserModel, TokenModel]
}