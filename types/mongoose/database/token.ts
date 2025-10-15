import { EncodedTokenType } from "../../token";
import { TokenModelType } from "../models";

export interface TokenDatabaseFunction<T>{
    (tokenModel: TokenModelType, tokenData: Partial<EncodedTokenType>): T
}