import prisma from "../db";
import argon2 from "argon2";
import { userDTO, userResponseDTO, usersListDTO } from "../dto/user";

export type UserCreationParams = Pick<userDTO, "email" | "firstname" | "lastname" | "password">;

export class UserService {

    public async get(id: number): Promise<userResponseDTO> {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new Error("User not found");
        }

        return {
            id: user.id,
            email: user.email
        }
    }

    public async getAll(): Promise<usersListDTO[]> {
        const users = await prisma.user.findMany();

        if (!users) {
            throw new Error("Users not found");
        }

        return users.map(user => ({
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname
        }));
    }

    public async create(params: UserCreationParams): Promise<Omit<userDTO, "password">> {
        if (!params.password || typeof params.password !== "string") {
            throw new Error("Password must be a string");
        }
        const hashedPassword = await argon2.hash(params.password);
        const user = await prisma.user.create({
            data: {
                email: params.email,
                firstname: params.firstname,
                lastname: params.lastname,
                password: hashedPassword
            }
        });

        return {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname
        }
    }
}