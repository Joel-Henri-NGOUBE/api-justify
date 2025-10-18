import jwt, { Secret } from "jsonwebtoken";
import { getEpochOfTheLastMomentOfTheDay } from "../date";
import { UserDataType } from "../../user";
import { TokenDataInterface } from "../../token";

/**
 * Generates a token based on the user data
 * @param userData The data of the requesting user
 * @returns The generated token
 */
export function generateToken(userData: UserDataType): string{
    // Setting the data that'll be stored in the token
    const tokenData: TokenDataInterface = {...userData, exp: getEpochOfTheLastMomentOfTheDay(), iat: Math.floor(Date.now() / 1000)}

    const token: string = jwt.sign(tokenData, (process.env.JWT_SECRET) as Secret)
    return token
}