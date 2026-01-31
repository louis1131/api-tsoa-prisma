import { Controller, Request, Route, Get, Path, Post, Body, SuccessResponse, Security } from "tsoa";
import { UserService, UserCreationParams } from "../services/userService";

@Route("private")
export class PrivateController extends Controller {

    @Get()
    public async getMe(@Request() request: any) {
        // const id = request.user.id;
        // inject payload with middleware ??
        return "Hello ${user.firstname}";
    }
}