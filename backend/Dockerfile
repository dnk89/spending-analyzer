FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["src/SpendingAnalyzer.Core/SpendingAnalyzer.Core.csproj", "SpendingAnalyzer.Core/"]
COPY ["src/SpendingAnalyzer.Infrastructure/SpendingAnalyzer.Infrastructure.csproj", "SpendingAnalyzer.Infrastructure/"]
COPY ["src/SpendingAnalyzer.Api/SpendingAnalyzer.Api.csproj", "SpendingAnalyzer.Api/"]
RUN dotnet restore "SpendingAnalyzer.Api/SpendingAnalyzer.Api.csproj"

COPY src/. ./
RUN dotnet build "SpendingAnalyzer.Api/SpendingAnalyzer.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SpendingAnalyzer.Api/SpendingAnalyzer.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SpendingAnalyzer.Api.dll"]