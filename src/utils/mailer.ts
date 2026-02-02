import "dotenv/config";
import nodemailer from "nodemailer";

// Create a transporter to handles the connexion with email service (gmail)
// Allows you to send emails on our behalf
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // SSL
    secure: true, // Connection is already TLS not need to update
    auth: {
        user: process.env.GOOGLE_MAIL,
        pass: process.env.GOOGLE_APP_PASSWORD
    }
});