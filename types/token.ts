import mongoose from "mongoose";
import { UserDataType } from "./user";

export interface TokenDataInterface extends UserDataType{
    exp: string,
    iat: string
}

export type EncodedTokenType = {
    value: string,
    userId: mongoose.Schema.Types.ObjectId
}