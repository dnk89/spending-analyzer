FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files first
COPY backend/src/SpendingAnalyzer.Api/SpendingAnalyzer.Api.csproj src/SpendingAnalyzer.Api/
COPY backend/src/SpendingAnalyzer.Core/SpendingAnalyzer.Core.csproj src/SpendingAnalyzer.Core/
COPY backend/src/SpendingAnalyzer.Infrastructure/SpendingAnalyzer.Infrastructure.csproj src/SpendingAnalyzer.Infrastructure/

# Restore dependencies
RUN dotnet restore src/SpendingAnalyzer.Api/SpendingAnalyzer.Api.csproj

# Copy the rest of the source code
COPY backend/src/ src/

# Build and publish
RUN dotnet publish src/SpendingAnalyzer.Api/SpendingAnalyzer.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SpendingAnalyzer.Api.dll"]