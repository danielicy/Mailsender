const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Key Authentication Middleware
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    const validApiKey = process.env.API_KEY;

    if (!validApiKey) {
        console.warn('Warning: API_KEY not set in environment variables');
        return next();
    }

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: 'API key is required',
            message: 'Please provide API key in X-API-Key header or apiKey query parameter'
        });
    }

    if (apiKey !== validApiKey) {
        return res.status(403).json({
            success: false,
            error: 'Invalid API key',
            message: 'The provided API key is not valid'
        });
    }

    next();
};

// Create transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.log('Error with email configuration:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'running',
        message: 'Mail Sender API is active',
        endpoints: {
            sendEmail: 'POST /api/send-email'
        }
    });
});

// Send email endpoint (protected with API key)
app.post('/api/send-email', apiKeyAuth, async (req, res) => {
    try {
        const { to, subject, message } = req.body;

        // Validate required fields
        if (!to || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: "to" and "message" are required'
            });
        }

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject || 'New Message',
            text: message,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>`
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId,
            to: to
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send email',
            details: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Mail Sender API is running on http://localhost:${PORT}`);
    console.log(`Send POST requests to http://localhost:${PORT}/api/send-email`);
});
