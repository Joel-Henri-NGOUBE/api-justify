import mongoose from "mongoose";
import { UserDataType } from "../user";
import { EncodedTokenType } from "../token";

export type UserSchemaType = mongoose.Schema<UserDataType>

export type TokenSchemaType = mongoose.Schema<EncodedTokenType>