import mongoose from "mongoose";
import { TokenSchemaType, UserSchemaType } from "./schemas";

export type UserModelType = typeof mongoose.Model<UserSchemaType>

export type TokenModelType = typeof mongoose.Model<TokenSchemaType>