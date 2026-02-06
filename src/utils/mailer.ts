import "dotenv/config";
import nodemailer from "nodemailer";

// Create a transporter to handle the connection with the email service (Gmail).
// This transporter allows the application to send emails on our behalf.
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Here we used smtp.gmail services, you only need to create a password application with your gmail account.
    port: 587, // SSL
    secure: false, // Connection is already TLS not need to update.
    auth: {
        // Configure your value in the .env file by referring to the .env.example file.
        user: process.env.GOOGLE_MAIL,
        pass: process.env.GOOGLE_APP_PASSWORD
    }
});