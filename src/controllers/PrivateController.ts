import * as express from "express";
import { Controller, Get, Request, Route, Security } from "tsoa";
import { HttpError } from "../errors/HttpErrors";

@Route("private")
@Security("bearer")
export class PrivateController extends Controller {

    @Get()
    public async hello(@Request() request: express.Request): Promise<{ message: string}> {
        if(!request.user) {
            throw new HttpError(401, "Unauthorized");
        }
        return { message: `Hello ${request.user.firstname}` }
    }
}