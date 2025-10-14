import mongoose from "mongoose";
import { UserSchemaType } from "./schemas";

export type UserModelType = typeof mongoose.Model<UserSchemaType>