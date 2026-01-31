import { Controller, Request, Route, Get, Post, Body } from "tsoa";
import { AuthService, loginRequestParams } from "../services/authService";

@Route("login")
export class AuthController extends Controller {
    @Post()
    public async login(@Body() requestBody: loginRequestParams): Promise<{token: string}> {
        return new AuthService().login(requestBody);
    }
}