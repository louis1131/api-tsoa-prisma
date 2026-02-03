import * as express from "express";
import { Body, Controller, Post, Get, Request, Route, SuccessResponse, Response } from "tsoa";
import { AuthService, LoginRequestParams, UserCreationParams } from "../services/authService";
import { loginResponseDTO } from "../dto/user";
import { EmailService } from "../services/emailService";
import { HttpError } from "../errors/HttpErrors";
import { DisposableEmailError, EmailAlreadyUsedError } from "../errors/UserErrors";


// Defining a route for all authentication-related endpoints
@Route("auth")
export class AuthController extends Controller {

    // POST endpoint for user login
    @Post("login")
    @Response<{ message: string }>(400, "Invalid credentials")
    @Response<{ message: string }>(422, "Validation failed")
    public async login(@Body() requestBody: LoginRequestParams): Promise<loginResponseDTO> {
        return new AuthService().login(requestBody);
    }

    // POST endpoint for user registration
    @SuccessResponse("201", "Created")
    @Post("register")
    @Response<{ message: string }>(409, "Email already in use")
    @Response<{ message: string }>(422, "Validation failed")
    @Response<{ message: string}>(422, "Disposable email addresses are not allowed")
    public async createUser(@Body() requestBody: UserCreationParams): Promise<void> {
        try {
            // Attempt to create a new user
            await new AuthService().create(requestBody);
            return;   
        } catch (err: any) {
            // Handle specific errors for email already in use or disposable email
            if (err instanceof EmailAlreadyUsedError) throw new HttpError(409, "Email already in use");
            if (err instanceof DisposableEmailError) throw new HttpError(422, "Disposable email addresses are not allowed");
            
            throw new HttpError(500, err.message);
        }
    }

    // GET endpoint for email verification using a token
    @Get("verify-email")
    @Response<{ message: string }>(400, "Token is missing or invalid")
    @Response<{ message: string }>(422, "Validation failed")
    @Response<{ message: string }>(500, "Internal server error")
    public async emailVerification(@Request() request: express.Request): Promise<{ message: string }> {
        // Extract the token from the query parameters
        const token = request.query.token as string;

        if (!token) {
            throw new HttpError (400, "Token is missing");
        }

        try {
            // Verify the email token and return the result message
            const message = await new EmailService().verifyEmailToken(token);
            return { message };
        } catch (err: any) {
            throw new Error (err.message);
        }
    }
}
