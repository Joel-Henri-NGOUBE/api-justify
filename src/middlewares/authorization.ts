import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { OK_STATUS_CODE, UNAUTHORIZED_STATUS_CODE } from "../utils/constants";
import { ResponseType } from "../responses";
import { writeJsonResponse } from "../utils/responses/jsonResponse";
import { EncodedTokenWithMongoExtrasInterface, TokenDataInterface } from "../token";

export function findIfIsAuthorized(req: Request, res: Response, next: NextFunction): void | Response<ResponseType>{
    // In order to retrieve the token
    const authorization = req.headers.authorization

    let isThereVerificationError: boolean = false

    let errorMessage: string = ""

    const response: ResponseType = {
        status: OK_STATUS_CODE,
        message: ""
    }

    if(!authorization){
        const jsonResponse = writeJsonResponse(response, UNAUTHORIZED_STATUS_CODE, "You do not have any token to permit you to justify your text")
        return res.status(UNAUTHORIZED_STATUS_CODE)
        .json(jsonResponse)
    }
    // Get the token part of the authorization header
    const token: string = authorization.split(" ")[1]

    jwt.verify(token, (process.env.JWT_SECRET as Secret), (error, decoded) => {
        if(error){
            isThereVerificationError = true
            const isTokenExpired: boolean = error.name === "TokenExpiredError"
            errorMessage = isTokenExpired ? error.message + ". Please, generate a brand new token." : error.message
            res.status(UNAUTHORIZED_STATUS_CODE)
        }else{
            res.locals.tokenData = decoded
            res.locals.token = token
        }
    })

    if(isThereVerificationError){
        return res.json(writeJsonResponse(response, UNAUTHORIZED_STATUS_CODE, errorMessage)) 
    }

    next()
}