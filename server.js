const express = require("express");
const nodemailer = require("nodemailer");
const multer  = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

// Multer: Handle file uploads
const upload = multer({ dest: "uploads/" });

// Configure Nodemailer for Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "hulkavengers84@gmail.com",  // Replace with your actual Gmail
        pass: "pjdt vfhz lkxg qgms" // Replace with your generated App Password
    }
});

// Endpoint to receive the PDF and send an email with it as an attachment
app.post("/send-email", upload.single("pdf"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    
    const filePath = req.file.path;

    // Email Options
    const mailOptions = {
        from: "hulkavengers84@gmail.com",
        to: "hulkavengers84@gmail.com",
        subject: "New Signed Authority Letter",
        text: "Attached is the signed authority letter.",
        attachments: [{
            filename: "authority-letter.pdf",
            path: filePath
        }]
    };

    // Send email using Nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
        // Delete file after sending email
        fs.unlink(filePath, (unlinkError) => {
            if (unlinkError) {
                console.error("Error deleting file:", unlinkError);
            }
        });

        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).send("Error sending email.");
        }
        res.send("Email sent successfully!");
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
