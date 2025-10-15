import mongoose from "mongoose";
import { TokenModelType, UserModelType } from "./models";

export type ModelTypes = [UserModelType, TokenModelType]

export type MongoExtras = {
    _id: mongoose.Types.ObjectId,
    __v: number
}