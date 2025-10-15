import { TokenDatabaseFunction } from "../mongoose/database/token";
import { EncodedTokenWithMongoExtrasInterface } from "../token";

/**
 * 
 * @param tokenModel 
 * @param tokenData 
 * @returns 
 */
export const findToken: TokenDatabaseFunction<Promise<EncodedTokenWithMongoExtrasInterface | null>> = async (tokenModel, tokenData) => {
    const data: EncodedTokenWithMongoExtrasInterface | null = await tokenModel.findOne(tokenData).then((result) => result)
    return data
}