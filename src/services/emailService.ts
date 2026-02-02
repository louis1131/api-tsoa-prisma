import "dotenv/config";
import { transporter } from "../utils/mailer";
import jwt from "jsonwebtoken";
import prisma from "../db";
import { User } from "@prisma/client";

const secret = process.env.JWT_SECRET_EMAIL;
const url = process.env.EMAIL_VERIFICATION_URL;

export class EmailService {
    public async sendVerificationEmail(user: User): Promise <void> {
        if (!secret) {
            throw new Error ("JWT_SECRET_EMAIL is not defined");
        }

        const token = jwt.sign({ user_id: user.id }, secret, {
            expiresIn: "30m"
        });

        const verificationUrl = `${url}${token}`;

        try {
            await transporter.sendMail({
                from: process.env.GOOGLE_MAIL,
                to: user.email,
                subject: "Verify your e-mail",
                text: `Hello ${user.firstname || ""}, please verify your email address by clicking the link below : \n${verificationUrl}`,
                html: `
                    <p>Hello ${user.firstname || ""}</p>
                    <p>Please verify your email adress by clicking the button below :</p>
                    <a
                        href="${verificationUrl}"
                        style="
                            display: inline-block;
                            padding: 12px 20px;
                            background-color: rgb(37, 99, 235);
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 6px;
                            font-weight: bold;
                            box-shadow: rgba(37, 99, 235, 0.30) 0px 5px 15px;
                        ">Verify my email
                    </a>
                    <p>If the button does not work, copy and paste this link into your browser :</p>
                    <p>${verificationUrl}</p>
                `,
            });     
        } catch (err: any) {
            console.error("Failed to send verification email :", err);
            throw new Error("Could not send verification email");
        }  
    }

    public async verifyEmailToken(token: string): Promise<string> {
        let decoded: { user_id: number };

        if (!secret) throw new Error ("JWT_SECRET_EMAIL is not defined");

        try {
            decoded = jwt.verify(token, secret) as { user_id: number };
        } catch (err) {
            throw new Error ("Invalid or expired token");
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.user_id }
        });

        if (!user) throw new Error ("User not found");

        if (user.email_verification === true) return "Email already verified";

        await prisma.user.update({
            where: { id: decoded.user_id },
            data: { email_verification: true}
        });

        return "Email successfully verified";
    }
}
