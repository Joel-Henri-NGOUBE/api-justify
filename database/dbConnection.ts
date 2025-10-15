import mongoose from "mongoose";
import { TokenSchemaType, UserSchemaType } from "../types/mongoose/schemas";
import { TokenModelType, UserModelType } from "../types/mongoose/models";
import { ModelTypes } from "./mongoose/mongoose";
import { UserDataType } from "./user";


export function dbConnection(): ModelTypes{
    const dbUri: string = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.xng7q05.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    
    mongoose.connect(dbUri, {
        dbName: "justify"
    })
    
    const UserSchema: UserSchemaType = new mongoose.Schema({
        email: String
    })
    
    const TokenSchema: TokenSchemaType = new mongoose.Schema({
        value: String,
        userId: mongoose.Schema.Types.ObjectId,
        remainingRate: Number
    })

    const UserModel: UserModelType = mongoose.model('User', UserSchema)

    const TokenModel: TokenModelType = mongoose.model('Token', TokenSchema)

    return [UserModel, TokenModel]
}