# Mail Sender API

A simple REST API application for sending emails using Node.js, Express, and Nodemailer.

## Features

- REST API endpoint to send emails
- API Key authentication for security
- Accepts destination address and message
- Supports various email services (Gmail, Outlook, Yahoo, etc.)
- JSON response format
- Docker support for easy deployment

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

3. Configure your settings in `.env`:
   - Set `API_KEY` to a secure random string (used for authentication)
   - For Gmail: Enable 2FA and generate an App Password
   - Set `EMAIL_USER` to your email address
   - Set `EMAIL_PASSWORD` to your app password

## Running the Application

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Send Email

**POST** `/api/send-email`

**Authentication Required:** API Key must be provided in `X-API-Key` header or `apiKey` query parameter

**Headers:**

```
X-API-Key: your-api-key-here
Content-Type: application/json
```

**Request Body:**

```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject (optional)",
  "message": "Your message here"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<message-id>",
  "to": "recipient@example.com"
}
```

**Response (Error - Missing/Invalid API Key):**

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is not valid"
}
```

**Response (Other Errors):**

```json
{
  "success": false,
  "error": "Error description",
  "details": "Detailed error message"
}
```

### Health Check

**GET** `/`

**No Authentication Required**

Returns API status and available endpoints.

## Example Usage

Using curl:

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key-here" \
  -d "{\"to\":\"recipient@example.com\",\"subject\":\"Test Email\",\"message\":\"Hello, this is a test message!\"}"
```

Using PowerShell:

```powershell
$headers = @{
    "X-API-Key" = "your-api-key-here"
}

$body = @{
    to = "recipient@example.com"
    subject = "Test Email"
    message = "Hello, this is a test message!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/send-email" -Method POST -Body $body -ContentType "application/json" -Headers $headers
```

## Gmail Configuration

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to Security → App Passwords
4. Generate a new app password for "Mail"
5. Use this 16-character password in your `.env` file

## Supported Email Services

- Gmail
- Outlook/Hotmail
- Yahoo
- iCloud
- And many others supported by Nodemailer
