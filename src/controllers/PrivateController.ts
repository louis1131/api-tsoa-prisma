import { Controller, Request, Route, Get, Path, Post, Body, SuccessResponse, Security } from "tsoa";
import * as express from "express";

@Route("private")
@Security("bearer")
export class PrivateController extends Controller {

    @Get()
    public async hello(@Request() request: express.Request): Promise<{ message: string}> {
        if(!request.user) {
            throw new Error("Unauthorized");
        }
        return { message: `Hello ${request.user.firstname}` }
    }
}