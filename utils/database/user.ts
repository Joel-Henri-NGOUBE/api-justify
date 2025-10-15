import { UserDatabaseFunction } from "../mongoose/database/user";
import { UserDataWithMongoExtrasInterface } from "../user";

/**
 * Find a user in the database
 * @param userModel The mongoose model
 * @param userData The requirements of the user to find
 * @returns The corresponding user
 */
export const findUser: UserDatabaseFunction<Promise<UserDataWithMongoExtrasInterface | null>> = async (userModel, userData) => {
    const data: UserDataWithMongoExtrasInterface | null = await userModel.findOne(userData)
    return data
    // return data.then((result: UserDataWithMongoExtrasInterface | null) => result)
}

/**
 * Insert a user in the database
 * @param userModel The mongoose model
 * @param userData The data to insert
 */
export const insertUser: UserDatabaseFunction<void> = async (userModel, userData) => {
    await userModel.insertOne(userData)
}
