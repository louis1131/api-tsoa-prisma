import { Controller, Request, Route, Get, Path, Post, Body, SuccessResponse, Security } from "tsoa";
import { userDTO, userResponseDTO, usersListDTO } from "../dto/user";
import { UserService, UserCreationParams } from "../services/userService";

@Route("users")
export class UserController extends Controller {

    @Get()
    public async getAllUser(): Promise<usersListDTO[]> {
        return new UserService().getAll();
    }

    @Get("{userId}")
    public async getUser(
        @Path() userId: number
    ): Promise<userResponseDTO> {
        return new UserService().get(userId);
    }
    
    @SuccessResponse("201", "Created")
    @Post()
    public async createUser(@Body() requestBody: UserCreationParams): Promise<void> {
        this.setStatus(201);
        new UserService().create(requestBody);
        return;
    }

}