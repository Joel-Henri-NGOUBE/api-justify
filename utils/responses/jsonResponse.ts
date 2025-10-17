import { ResponseType } from "."
import { OK_STATUS_CODE } from "../constants"
/**
 * Builds up an object that can be used in the routes responses
 * @param res A ResponseType object
 * @param statusCode The status code of the response
 * @param message The message of the response
 * @param token The token of the requesting user
 * @returns 
 */
export function writeJsonResponse(res: ResponseType, statusCode: ResponseType["status"] = OK_STATUS_CODE, message: ResponseType["message"] = "", token?: ResponseType["token"], remainingRate?: ResponseType["remainingRate"]): ResponseType{
    res.message = message
    res.status = statusCode
    if(token){
        res.token= token
    }
    if(remainingRate || remainingRate === 0){
        res.remainingRate= remainingRate
    }
    return res
}