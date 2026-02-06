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

async function seedUsers() {
    const userRole = await prisma.role.findUnique({
        where: { name: "user" },
    });

    if (!userRole) {
        throw new Error("Missing user role");
    }

    await prisma.user.upsert({
        where: { email: "user@example.com" },
        update: {
            firstname: "User",
            lastname: "Verified",
            email_verification: true,
            password: await argon2.hash("user123"),
            role_id: userRole.id,
        },
        create: {
            email: "user@example.com",
            firstname: "User",
            lastname: "Root",
            email_verification: true,
            password: await argon2.hash("user123"),
            role_id: userRole.id,
        },
    });

    await prisma.user.upsert({
        where: { email: "usernotverify@example.com" },
        update: {
            firstname: "User",
            lastname: "Not Verified",
            email_verification: false,
            password: await argon2.hash("user123"),
            role_id: userRole.id,
        },
        create: {
            email: "usernotverify@example.com",
            firstname: "User",
            lastname: "Not Verified",
            email_verification: false,
            password: await argon2.hash("user123"),
            role_id: userRole.id,
        },    
    });

    console.log("✅ Users seeded");
}

async function main() {
    console.log("🌱 Seeding database...");
    await deleteAllUsers();
    await seedRoles();
    await seedAdmin();
    await seedUsers();
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