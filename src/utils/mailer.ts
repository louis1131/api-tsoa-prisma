import "dotenv/config";
import { Resend } from "resend";
// import nodemailer from "nodemailer";

/* // Create a transporter to handle the connection with the email service (Gmail).
// This transporter allows the application to send emails on our behalf.
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Here we used smtp.gmail services, you only need to create a password application with your gmail account.
    port: 465, // SSL
    secure: true, // Connection is already TLS not need to update.
    auth: {
        // Configure your value in the .env file by referring to the .env.example file.
        user: process.env.GOOGLE_MAIL,
        pass: process.env.GOOGLE_APP_PASSWORD
    }
}); */

// Resend needs a domain name at the moment 
// I don't have one, so email verification only works in development or locally in production with nodemailer 
// and the variables available in env.example (SMTP Services).
export const resend = new Resend(process.env.RESEND_MAIL_API_KEY);