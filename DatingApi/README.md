# Dating API

This is the ASP.NET Core Web API backend for the Dating Angular application.

## Features

- User Authentication & Authorization (JWT)
- User Profile Management
- Matching System
- Real-time Messaging
- Password Reset Functionality

## Technologies Used

- ASP.NET Core 8.0
- Entity Framework Core
- SQL Server (LocalDB)
- JWT Authentication
- Identity Framework

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-reset-token/{token}` - Verify reset token

### Profile

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/photo` - Upload profile photo
- `DELETE /api/profile/photo` - Delete profile photo

### Matches

- `GET /api/matches` - Get user's matches
- `GET /api/matches/potential` - Get potential matches
- `POST /api/matches/respond` - Respond to match (like/pass)
- `DELETE /api/matches/{matchId}` - Unmatch
- `GET /api/matches/{matchId}` - Get match details

### Messages

- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/conversations/{conversationId}` - Get messages in conversation
- `POST /api/messages` - Send message
- `PUT /api/messages/conversations/{conversationId}/read` - Mark messages as read
- `DELETE /api/messages/{messageId}` - Delete message
- `GET /api/messages/conversations/{conversationId}/details` - Get conversation details

## Setup Instructions

1. Navigate to the DatingApi directory:

   ```bash
   cd DatingApi
   ```

2. Restore packages:

   ```bash
   dotnet restore
   ```

3. Update the database:

   ```bash
   dotnet ef database update
   ```

4. Run the API:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:5001` (HTTPS) and `http://localhost:5000` (HTTP).

## Configuration

Update `appsettings.json` for:

- Database connection string
- JWT settings (Key, Issuer, Audience)
- CORS origins (for Angular app)

## Database

The application uses SQL Server LocalDB. The connection string is configured in `appsettings.json`.

To reset the database:

```bash
dotnet ef database drop
dotnet ef database update
```

## Authentication

The API uses JWT Bearer tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer {token}
```

## CORS

CORS is configured to allow requests from `http://localhost:4200` (Angular dev server) and `https://localhost:4200`.
