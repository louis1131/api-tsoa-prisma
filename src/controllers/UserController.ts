import * as express from "express";
import { Body, Controller, Delete, Get, Patch, Path, Request, Route, Security, SuccessResponse, Response } from "tsoa";
import { userResponseDTO, usersListDTO, userUpdateDTO } from "../dto/user";
import { UserService, UserUpdateParams } from "../services/userService";
import { HttpError } from "../errors/HttpErrors";

// The Response decorator is only needed for documentation via Swagger, it does not affect the code.

@Route("users")
export class UserController extends Controller {

    @Get()
    @Security("bearer", ["admin"])
    @SuccessResponse(200, "List of all users")
    @Response<{ message: string }>(401, "Unauthorized")
    @Response<{ message: string }>(422, "Validation failed")
    public async getAllUser(): Promise<usersListDTO[]> {
        return new UserService().getAll();
    }

    @Get("me")
    @Security("bearer")
    @SuccessResponse(200, "Current user details")
    @Response<{ message: string }>(401, "User not authenticated")
    public async getMe(@Request() request: express.Request): Promise<userResponseDTO> {
        const user = request.user;
        if(!user) {
            throw new HttpError(401, "User not authenticated")
        }
        return new UserService().getMe(user);
    }

    @Patch("me")
    @Security("bearer")
    @SuccessResponse(200, "User updated")
    @Response<{ message: string }>(401, "User not authenticated")
    @Response<{ message: string }>(422, "Validation failed")
    public async updateMe(@Body() requestBody: UserUpdateParams, @Request() request: express.Request): Promise<userUpdateDTO> {
        const user = request.user;
        if(!user) {
            throw new HttpError(401, "User not authenticated");
        }
        return new UserService().updateMe(user, requestBody);
    }

    @Get("{userId}")
    @Security("bearer", ["admin"])
    @SuccessResponse(200, "User details")
    @Response<{ message: string }>(401, "Unauthorized")
    @Response<{ message: string }>(404, "User not found")
    public async getUser(@Path() userId: number): Promise<userResponseDTO> {
         return new UserService().getOne(userId);
    }

    @Patch("{userId}")
    @Security("bearer", ["admin"])
    @SuccessResponse(200, "User updated")
    @Response<{ message: string }>(401, "Unauthorized")
    @Response<{ message: string }>(404, "User not found")
    @Response<{ message: string }>(422, "Validation failed")
    public async updateOne(@Path() userId: number, @Body() requestBody: UserUpdateParams, @Request() request: express.Request): Promise<userUpdateDTO> {
        const user = request.user;
        if (!user) {
            throw new HttpError (401, "User not authenticated");
        }
        return new UserService().updateOne(userId, user, requestBody);
    }
    
    @Delete("{userId}")
    @Security("bearer", ["admin"])
    @SuccessResponse(200, "User deleted")
    @Response<{ message: string }>(401, "Unauthorized")
    @Response<{ message: string }>(404, "User not found")
    public async deleteOne(@Path() userId: number, @Request() request: express.Request): Promise<{ account_deleted: boolean}> {
        const user = request.user;
        if (!user) {
            throw new HttpError (401, "User not authenticated");
        }
        return new UserService().deleteOne(userId, user);
    }
}