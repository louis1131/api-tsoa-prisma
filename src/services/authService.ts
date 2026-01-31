import "dotenv/config";
import prisma from "../db";
import argon2 from "argon2";
// import jwt from "jsonwebtoken";
import { loginRequestDTO, loginResponseDTO } from "../dto/user";

export type loginRequestParams = Pick<loginRequestDTO, "email" | "password">;

export class AuthService {

        public async login(params: loginRequestDTO): Promise<loginResponseDTO> {
        const user = await prisma.user.findUnique({
            where: { email: params.email },
        });

        if (!user || !await argon2.verify(user.password, params.password)) {
            throw new Error("Invalid username or password");
        }

        /* const token = await jwt.sign({ user_id: user.id, user_email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        }); */

        return { token: "TOKEN HERE" };
    }
}