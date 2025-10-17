import { ResponseType } from "./responses";
/**
 * Builds up an object that can be used in the routes responses
 * @param res A ResponseType object
 * @param statusCode The status code of the response
 * @param message The message of the response
 * @param token The token of the requesting user
 * @returns 
 */
export function writeJsonResponse(res: ResponseType, statusCode: ResponseType["status"] = 200, message: ResponseType["message"] = "", token?: ResponseType["token"]): ResponseType{
    res.message = message
    res.status = statusCode
    if(token){
        token = res.token
    }
    return res
}