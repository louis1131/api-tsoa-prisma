import "dotenv/config";
import prisma from "../db";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { userDTO, loginRequestDTO, loginResponseDTO } from "../dto/user";

// Build a type with all proprieties specified
export type UserCreationParams = Pick<userDTO, "email" | "firstname" | "lastname" | "password" | "role">;
export type LoginRequestParams = Pick<loginRequestDTO, "email" | "password">;

export class AuthService {

    public async login(params: LoginRequestParams): Promise<loginResponseDTO> {
        const user = await prisma.user.findUnique({
            where: { email: params.email },
        });

        if (!user || !await argon2.verify(user.password, params.password)) {
            throw new Error("Invalid username or password");
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET is not defined");

        const token = await jwt.sign({ user_id: user.id }, secret, {
            expiresIn: "1h"
        });

        return { token: token };
    }

    // Creates a new user from the request body.
    // Expects the input to match the UserCreationParams type.
    // Hashes the password before storing it in the database.
    // Returns a Promise resolving to a userDTO without the password field.
    public async create(params: UserCreationParams): Promise<Omit<userDTO, "password">> {
        if (!params.password || typeof params.password !== "string") {
            throw new Error("Password must be a string");
        }
        const hashedPassword = await argon2.hash(params.password);
        const userRole = await prisma.role.findUnique({ where: { name: "user" } })
        if (!userRole) throw new Error("Cannot create your account please retry later")
        const user = await prisma.user.create({
            data: {
                email: params.email,
                firstname: params.firstname,
                lastname: params.lastname,
                password: hashedPassword,
                role_id: userRole.id
            },
            include: { role: true }
        });

        return {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role.name
        }
    }
}