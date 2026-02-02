import * as express from "express";
import jwt from "jsonwebtoken";
import prisma from "../db";

const SECRET = process.env.JWT_SECRET || "secret";


export async function expressAuthentication(
    request: express.Request,
    securityName: string,
    requiredRole?: string
): Promise<any> {
    if (securityName !== "bearer") {
        return Promise.reject(new Error(`Unknown security: ${securityName}`));
    }

    let token = request.headers["authorization"] as string;
    if (!token) return Promise.reject(new Error("No token provided"));
    if (token.startsWith("Bearer ")) token = token.slice(7);

    // Check JWT
    let decoded: any;
    try {
        decoded = jwt.verify(token, SECRET);
    } catch (err) {
        return Promise.reject(err);
    }

    // Retrives user with his role
    const user = await prisma.user.findUnique({
        where: { id: decoded.user_id },
        include: { role: true },
    });

    if (!user) return Promise.reject(new Error("User not found"));

    if(requiredRole && requiredRole.includes(user.role.name)) {
        return user;
    } else if  (!requiredRole || requiredRole.length === 0) {
        return user;
    }

    return Promise.reject(new Error("Access denied"));
}