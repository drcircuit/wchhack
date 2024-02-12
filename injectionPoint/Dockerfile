FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY *.cs ./
COPY Controllers ./
COPY *.json ./
COPY Properties ./
RUN dotnet publish -c Release -o out
# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:3.1
RUN apt-get update
RUN apt-get install sqlite3 -y
WORKDIR /app
COPY setup.sql ./
ADD wwwroot ./wwwroot
RUN sqlite3 web.db < setup.sql
RUN ls -al
COPY --from=build-env /app/out .
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "injectionPoint.dll"]
