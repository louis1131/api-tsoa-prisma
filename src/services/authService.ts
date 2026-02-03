import "dotenv/config";
import prisma from "../db";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { userDTO, loginRequestDTO, loginResponseDTO } from "../dto/user";
import { rejectTempMail } from "../utils/emailChecker";
import { EmailService } from "./emailService";
import { DisposableEmailError, EmailAlreadyUsedError } from "../errors/UserErrors";

// Build a type with all propreties specified.
export type UserCreationParams = Pick<userDTO, "email" | "firstname" | "lastname" | "password" | "role">;
export type LoginRequestParams = Pick<loginRequestDTO, "email" | "password">;

export class AuthService {

    // Logs in a user with email and password.
    // - Expects the input to match the LoginRequestParams type.
    // - Verifies that the email exists and the password is correct using argon2.
    // - Checks if the user's email is verified; if not, returns a message prompting verification.
    // - Generates a JWT containing the user's ID with a 1-hour expiration if login succeeds.
    // - Returns a Promise resolving to an object containing either the JWT token or a message.
    public async login(params: LoginRequestParams): Promise<loginResponseDTO> {
        const user = await prisma.user.findUnique({
            where: { email: params.email }, // Look for user by email.
        });

        if (!user || !await argon2.verify(user.password, params.password)) {
            throw new Error("Invalid email or password");
        }

        if (user.email_verification === false) {
            return { message: "Please verify your email" }; // Prevent login if email not verified.
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET is not defined"); 

        const token = jwt.sign({ user_id: user.id }, secret, {
            expiresIn: "1h"
        });

        return { token: token };
    }

    // Creates a new user from the request body.
    // Expects the input to match the UserCreationParams type.
    // Hashes the password before storing it in the database.
    // Call the sendVerificationEmail function with the created user as a parameter.
    // Returns a Promise resolving to a userDTO without the password field.
    public async create(params: UserCreationParams): Promise<Omit<userDTO, "password"> | string> {
        if (rejectTempMail(params.email)) {
            throw new DisposableEmailError();
        }
        
        if (!params.password || typeof params.password !== "string") {
            throw new Error("Password must be a string"); // Validate password
        }

        const hashedPassword = await argon2.hash(params.password);
        const userRole = await prisma.role.findUnique({ where: { name: "user" } }); // Default role

        if (!userRole) throw new Error("Cannot create your account please retry later");

        try {
            // Create user in database
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

            try {
                await new EmailService().sendVerificationEmail(user);  
            } catch (err) {
                console.error("Failed to send verification email", err);
            }

            // Return DTO without password
            return {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role.name
            };

        } catch (err: any) {
            if (err.code === "P2002") {
                throw new EmailAlreadyUsedError(); // Prisma unique constraint violation
            }
            throw err;
        }
    }
}