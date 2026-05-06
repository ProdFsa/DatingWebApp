# Backend Implementation Guide - Forgot Password Feature

## Overview

This guide explains how to implement the backend endpoints for the forgot password feature.

## Required Endpoints

### 1. POST /api/auth/forgot-password

**Purpose:** Send a password reset email to the user

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response (Success - 200):**

```json
{
  "message": "Password reset link has been sent to your email. Please check your inbox.",
  "success": true
}
```

**Response (Error - 400 or 404):**

```json
{
  "message": "Email not found in our system",
  "error": "Email not found"
}
```

**Implementation Steps:**

1. Validate email format
2. Find user by email in database
3. Generate a secure reset token:
   - Using JWT with expiration (15-30 minutes recommended)
   - OR using a cryptographically secure random token
4. Store reset token in database with:
   - User ID
   - Token value
   - Creation timestamp
   - Expiration timestamp
   - Used flag (false initially)
5. Send email to user with reset link:

   ```
   Click here to reset your password:
   https://yourdomain.com/reset-password?token=<token>

   This link will expire in 30 minutes.
   ```

6. Return success message

**Error Cases to Handle:**

- Email not found → Return 404
- Invalid email format → Return 400
- Email sending failed → Log error, still return success (don't expose email service issues)
- Database error → Return 500

---

### 2. GET /api/auth/verify-reset-token/{token}

**Purpose:** Verify that a reset token is valid and not expired

**Request:**

```
GET /api/auth/verify-reset-token/eyJhbGciOiJIUzI1NiIs...
```

**Response (Valid Token - 200):**

```json
{
  "valid": true,
  "email": "user@example.com"
}
```

**Response (Invalid/Expired Token - 401 or 400):**

```json
{
  "valid": false
}
```

**Implementation Steps:**

1. Parse/validate the token
2. Check if token exists in database
3. Check if token is expired
4. Check if token has already been used
5. Return validity status
6. Optionally return user email for UI display

**Error Cases to Handle:**

- Token not found → Return valid: false
- Token expired → Return valid: false
- Token already used → Return valid: false
- Invalid token format → Return valid: false

---

### 3. POST /api/auth/reset-password

**Purpose:** Reset user's password using a valid reset token

**Request Body:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response (Success - 200):**

```json
{
  "message": "Your password has been reset successfully!",
  "success": true
}
```

**Response (Error - 400 or 401):**

```json
{
  "message": "This password reset link has expired or is invalid",
  "error": "Invalid reset token"
}
```

**Implementation Steps:**

1. Validate reset token:
   - Check if token exists
   - Check if token is expired
   - Check if token has already been used
2. Validate passwords:
   - Check passwords match
   - Check password meets requirements (min 6 chars, etc.)
3. Find user associated with token
4. Hash new password using bcrypt (or similar):
   ```
   Example using bcrypt:
   const hashedPassword = await bcrypt.hash(newPassword, 10);
   ```
5. Update user's password in database
6. Mark reset token as used (update "used" flag in database)
7. Optionally: Delete/expire all other reset tokens for this user
8. Return success message

**Error Cases to Handle:**

- Token not found/invalid → Return 401 with "Invalid token"
- Token expired → Return 401 with "Token expired"
- Token already used → Return 401 with "Token already used"
- Passwords don't match → Return 400 with "Passwords don't match"
- Password doesn't meet requirements → Return 400 with requirements
- User not found → Return 404
- Database error → Return 500

---

## Database Schema Example

### Reset Tokens Table

```sql
CREATE TABLE reset_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX (token),
    INDEX (user_id),
    INDEX (expires_at)
);
```

### Users Table (Password Update)

```sql
-- Add this to users table if not already present
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NOT NULL;
ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

---

## Security Best Practices

### 1. Token Generation

```javascript
// Example using crypto module (Node.js)
const crypto = require("crypto");

function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}
```

### 2. Password Hashing

```javascript
// Example using bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
```

### 3. Token Expiration

- Set token expiration to 15-30 minutes
- Clean up expired tokens periodically:

```sql
DELETE FROM reset_tokens WHERE expires_at < NOW();
```

### 4. Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
// Max 3 forgot password requests per email per hour
// Max 5 reset attempts per token
```

### 5. Email Security

- Use HTTPS for reset links
- Don't expose sensitive info in logs
- Consider using email templates from services like SendGrid

### 6. Additional Validations

- Require email verification before account creation
- Implement login attempt rate limiting
- Log password reset events for security audit
- Consider implementing 2FA for sensitive operations

---

## Email Template Example

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .button {
        background-color: #dc3545;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
      }
      .warning {
        color: #dc3545;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the button below to create a new password.</p>

      <a href="https://yourdomain.com/reset-password?token={{TOKEN}}" class="button"> Reset Password </a>

      <p class="warning">
        This link will expire in 30 minutes.<br />
        If you didn't request this, you can safely ignore this email.
      </p>

      <hr />
      <p style="font-size: 12px; color: #666;">For security, never share this link with anyone.</p>
    </div>
  </body>
</html>
```

---

## Testing Endpoints

### Using curl:

**Test Forgot Password:**

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**Test Verify Token:**

```bash
curl -X GET http://localhost:3000/api/auth/verify-reset-token/your_token_here
```

**Test Reset Password:**

```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"your_token_here",
    "newPassword":"newPassword123",
    "confirmPassword":"newPassword123"
  }'
```

### Using Postman:

1. Create collection "Dating App Auth"
2. Add three requests with the above details
3. Set variables for `BASE_URL` and `TOKEN`
4. Test full flow end-to-end

---

## Debugging Tips

1. **Token not validating:**
   - Check token format and encoding
   - Verify token hasn't expired
   - Ensure token exists in database

2. **Email not sending:**
   - Check email service credentials
   - Verify email configuration
   - Check spam folder
   - Look for email service error logs

3. **Database errors:**
   - Verify schema is correct
   - Check database connections
   - Review transaction handling

4. **Security issues:**
   - Use HTTPS for all endpoints
   - Validate and sanitize all inputs
   - Implement CORS properly
   - Use secure session management

---

## Troubleshooting Checklist

- [ ] API endpoints return correct HTTP status codes
- [ ] Token generation is secure and unique
- [ ] Tokens expire after set time
- [ ] Expired tokens cannot be reused
- [ ] Passwords are hashed before storage
- [ ] Email sending works correctly
- [ ] Database schema is correct
- [ ] Rate limiting is implemented
- [ ] Error messages don't expose sensitive info
- [ ] All inputs are validated
- [ ] Reset links include correct token
- [ ] Email template is professional
- [ ] HTTPS is enforced
- [ ] Logs don't contain sensitive data
