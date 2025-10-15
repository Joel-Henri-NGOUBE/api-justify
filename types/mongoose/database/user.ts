import { UserDataType } from "../../user";
import { UserModelType } from "../models";

export interface UserDatabaseFunction<T>{
    (userModel: UserModelType, userData: UserDataType): T
}