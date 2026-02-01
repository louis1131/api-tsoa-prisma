// Initialize and exports a PrismaClient instance to be reused across the entire application

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;