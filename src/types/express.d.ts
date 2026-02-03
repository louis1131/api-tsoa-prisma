import { User, Role } from "@prisma/client";

// This globally declares a `user` property on the Express Request object,
// so TypeScript knows about it. It allows middleware to attach the authenticated
// user (with Prisma `User & { role: Role }`) to `request.user` safely.
declare global {
  namespace Express {
    interface Request {
      user?: User & { role: Role };
    }
  }
}

export {};