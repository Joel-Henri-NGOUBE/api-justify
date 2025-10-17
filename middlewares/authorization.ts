import { NextFunction, Request, Response } from "express";
import { writeJsonResponse } from "./responses/jsonResponse";
import { ResponseType } from "./responses";

export function findIfIsAuthorized(req: Request, res: Response, next: NextFunction): void | Response<ResponseType>{
    const authorization = req.headers.authorization

    const response: ResponseType = {
        status: 200,
        message: ""
    }

    if(!authorization){
        const jsonResponse = writeJsonResponse(response, 401, "You do not have any token to permit you to justify your text")
        return res.status(401)
        .json(jsonResponse)
    }
    next()
}