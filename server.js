const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/contact", async (req, res) => {

    // Extract form data
    const { name, email, message } = req.body;

    // Setup nodemailer transporter (Use correct credentials for production)
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SENDER, // Your Gmail
            pass: process.env.PASSWORD, // App password
        },
    });
    

    try {
        const info = await transporter.sendMail({
            from: `"Website Contact Form" <${process.env.SENDER}>`, 
            to: process.env.RECEIVER, 
            subject: "Website Message ALERT!!",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, 
            html: `<h2>From : ${name}</h2> <br/> <h4>Email : ${email}</h4>  <p>Message : <br> ${message}</p>`,
        });

        console.log("Message sent: %s", info.messageId);
        res.status(200).json({ message: "Form submitted successfully!" });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email", error });
    }
});

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));
