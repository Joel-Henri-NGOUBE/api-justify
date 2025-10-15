import mongoose from "mongoose";
import { UserDataType } from "./user";
import { MongoExtras } from "./mongoose/mongoose";

export interface TokenDataInterface extends UserDataType{
    exp: string,
    iat: string
}

export type EncodedTokenType = {
    value: string,
    userId: mongoose.Schema.Types.ObjectId
    remainingRate: number
}

export interface EncodedTokenWithMongoExtrasInterface extends EncodedTokenType, MongoExtras{}