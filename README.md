# Spending Analyzer

A full-stack application for analyzing personal spending with .NET backend and React frontend.

## Features

- Upload and manage transactions
- View spending analytics and trends
- Categorize transactions
- Interactive dashboard with charts and statistics

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Modern component architecture

### Backend
- .NET 8.0 Web API
- Entity Framework Core
- PostgreSQL database
- Clean architecture pattern

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- .NET SDK 8.0 (for local development)

### Running with Docker
1. Clone the repository
2. Navigate to the root directory
3. Run `docker-compose up -d`
4. Access the application at `http://localhost:3000`

### Local Development
1. Frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

2. Backend:
   ```bash
   cd backend
   dotnet restore
   cd src/SpendingAnalyzer.Api
   dotnet run
   ```

3. Database:
   ```bash
   docker-compose up db -d
   ```

## Project Structure

```
.
├── frontend/                # React frontend application
│   ├── src/                # Source files
│   │   ├── components/     # React components
│   │   └── ...
│   └── ...
├── backend/                # .NET backend application
│   └── src/
│       ├── SpendingAnalyzer.Api/           # Web API project
│       ├── SpendingAnalyzer.Core/          # Domain models and interfaces
│       └── SpendingAnalyzer.Infrastructure/ # Data access and implementation
└── docker-compose.yml      # Docker compose configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.