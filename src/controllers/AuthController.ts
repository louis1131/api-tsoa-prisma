import { Controller, Request, Route, Get, Post, Body, SuccessResponse } from "tsoa";
import { AuthService, LoginRequestParams, UserCreationParams } from "../services/authService";
import { userResponseDTO } from "../dto/user";

@Route("auth")
export class AuthController extends Controller {

    @Post("login")
    public async login(@Body() requestBody: LoginRequestParams): Promise<{token: string}> {
        return new AuthService().login(requestBody);
    }

    @SuccessResponse("201", "Created")
    @Post("register")
    public async createUser(@Body() requestBody: UserCreationParams): Promise<void> {
        new AuthService().create(requestBody);
        return;
    }

}
