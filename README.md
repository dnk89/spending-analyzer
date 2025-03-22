# Spending Analyzer

A web application for analyzing and categorizing personal spending from bank statements.

## Features

- Import bank statement CSV files
- Categorize transactions
- View spending summaries and analytics
- Docker support for easy deployment

## Technology Stack

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- Docker

### Frontend
- React with TypeScript
- Tailwind CSS
- Chart.js for visualizations

## Getting Started

### Prerequisites

- Docker and Docker Compose
- .NET 8 SDK (for local development)
- Node.js (for local frontend development)

### Running with Docker

```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Local Development

#### Backend
```bash
cd backend
dotnet run
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
├── backend/                 # ASP.NET Core Web API
│   ├── src/                # Source code
│   └── tests/              # Unit and integration tests
├── frontend/               # React frontend
│   ├── src/                # Source code
│   └── public/             # Static assets
├── docker-compose.yml      # Docker composition
└── README.md              # This file
```