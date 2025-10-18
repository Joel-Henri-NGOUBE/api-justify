import { MongoExtras } from "./mongoose/mongoose"

export type UserDataType = {
    email: string
}

export interface UserDataWithMongoExtrasInterface extends UserDataType, MongoExtras{}