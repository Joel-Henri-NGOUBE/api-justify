import mongoose from "mongoose";
import { TokenSchemaType, UserSchemaType } from "../types/mongoose/schemas";
import { TokenModelType, UserModelType } from "../types/mongoose/models";
import { ModelTypes } from "./mongoose/mongoose";
import { UserDataType } from "./user";
import { MONGO_DB_PASSWORD, MONGO_DB_USER } from "./constants";


export function dbConnection(): ModelTypes{
    const dbUri: string = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@cluster0.xng7q05.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    
    mongoose.connect(dbUri, {
        dbName: "justify"
    })
    
    // Creating schemas for the models
    const UserSchema: UserSchemaType = new mongoose.Schema({
        email: String
    })
    
    const TokenSchema: TokenSchemaType = new mongoose.Schema({
        value: String,
        userId: mongoose.Schema.Types.ObjectId,
        remainingRate: Number
    })

    // Creating models to access and interact with the database
    const UserModel: UserModelType = mongoose.model('User', UserSchema)

    const TokenModel: TokenModelType = mongoose.model('Token', TokenSchema)

    return [UserModel, TokenModel]
}