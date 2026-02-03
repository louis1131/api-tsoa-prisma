import "dotenv/config";
import prisma from "../src/db";
import argon2 from "argon2";

async function deleteAllUsers() {
    await prisma.user.deleteMany({});
    console.log("✅ All users delete");
}

async function seedRoles() {
    const roles = ["admin", "user"];

    for (const name of roles) {
        await prisma.role.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    console.log("✅ Roles Seeded");
}

async function seedAdmin() {
    const adminRole = await prisma.role.findUnique({
        where: { name: "admin" },
    });

    if (!adminRole) {
        throw new Error("Missing admin role");
    }

    await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {
            firstname: "Admin",
            lastname: "Root",
            email_verification: true,
            password: await argon2.hash("admin123"),
            role_id: adminRole.id,
        },
        create: {
            email: "admin@example.com",
            firstname: "Admin",
            lastname: "Root",
            email_verification: true,
            password: await argon2.hash("admin123"),
            role_id: adminRole.id,
        },
    });

    console.log("✅ Admin seeded");
}

async function main() {
    console.log("🌱 Seeding database...");
    await deleteAllUsers();
    await seedRoles();
    await seedAdmin();
    console.log("🎉 Seed finish");
}

main()
    .catch((e) => {
        console.error("❌ Seed error", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });