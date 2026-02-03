import * as express from "express";
import { Controller, Get, Request, Route, Security, SuccessResponse, Response } from "tsoa";
import { HttpError } from "../errors/HttpErrors";

@Route("private")
@Security("bearer")
export class PrivateController extends Controller {

    @Get()
    @SuccessResponse(200, "Request successful")
    @Response<{ message: string }>(401, "Unauthorized")
    @Response<{ message: string }>(422, "Validation failed")
    public async hello(@Request() request: express.Request): Promise<{ message: string}> {
        if(!request.user) {
            throw new HttpError(401, "Unauthorized");
        }
        return { message: `Hello ${request.user.firstname}` }
    }
}