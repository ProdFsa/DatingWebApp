# Dating Web Application

A full-stack dating application with Angular frontend and ASP.NET Core Web API backend.

## Project Structure

- **Frontend**: Angular application (`src/` directory)
- **Backend**: ASP.NET Core Web API (`DatingApi/` directory)

## Features

- User registration and authentication
- Profile management with photo uploads
- Matching system with like/pass functionality
- Real-time messaging between matches
- Password reset functionality
- Responsive design

## Prerequisites

- Node.js and npm (for Angular)
- .NET 8.0 SDK (for ASP.NET Core API)
- SQL Server LocalDB (included with Visual Studio)

## Setup Instructions

### Backend (ASP.NET Core API)

1. Navigate to the API directory:

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

The API will be available at `https://localhost:5001`.

### Frontend (Angular)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   ng serve
   ```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

## API Documentation

The API includes Swagger documentation available at `https://localhost:5001/swagger` when running in development mode.

## Configuration

### Frontend

Update `src/environments/environment.ts` and `environment.prod.ts` with the correct API URL.

### Backend

Update `DatingApi/appsettings.json` for database connection and JWT settings.

## Technologies Used

### Frontend

- Angular 13+
- TypeScript
- RxJS
- Angular Material (if used)

### Backend

- ASP.NET Core 8.0
- Entity Framework Core
- SQL Server
- JWT Authentication
- Identity Framework

## Development

### Running Tests

#### Frontend

```bash
ng test
```

#### Backend

```bash
cd DatingApi
dotnet test
```

### Building for Production

#### Frontend

```bash
ng build --prod
```

#### Backend

```bash
cd DatingApi
dotnet publish -c Release
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
