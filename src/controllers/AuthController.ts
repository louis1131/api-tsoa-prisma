import * as express from "express";
import { Body, Controller, Post, Get, Request, Route, SuccessResponse, Response } from "tsoa";
import { AuthService, LoginRequestParams, UserCreationParams } from "../services/authService";
import { loginResponseDTO } from "../dto/user";
import { EmailService } from "../services/emailService";

@Route("auth")
export class AuthController extends Controller {

    @Post("login")
    public async login(@Body() requestBody: LoginRequestParams): Promise<loginResponseDTO> {
        return new AuthService().login(requestBody);
    }

    @SuccessResponse("201", "Created")
    @Post("register")
    public async createUser(@Body() requestBody: UserCreationParams): Promise<void> {
        new AuthService().create(requestBody);
        return;
    }

    @Get("verify-email")
    public async emailVerification(@Request() request: express.Request): Promise<{ message: string }> {
        const token = request.query.token as string;

        if (!token) {
            throw new Error ("Token is missing");
        }

        try {
            const message = await new EmailService().verifyEmailToken(token);
            return { message };
        } catch (err: any) {
            throw new Error (err.message);
        }
    }
}
