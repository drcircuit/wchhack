FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /app
COPY . ./
RUN dotnet restore
RUN dotnet publish -c Release -o out

# Use the ASP.NET base image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime

# Install Apache
RUN apt-get update \
    && apt-get install -y apache2 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configure Apache to listen on port 8888
RUN sed -i 's/80/8888/g' /etc/apache2/ports.conf \
    && sed -i 's/:80/:8888/g' /etc/apache2/sites-available/000-default.conf

# Copy static content to Apache's serve directory
COPY index.html /var/www/html
ADD bin /var/www/html/bin

# Copy the built .NET app
WORKDIR /app
COPY --from=build-env /app/out .

# Set the environment variable for the echo server port
ENV ECHOPORT 8088

# Expose ports for HTTP (Apache) and the .NET TCP listener
EXPOSE 8088 8888

# Start Apache and the .NET app
# Using `supervisord` or another process manager is recommended to run multiple services in a container
CMD service apache2 start && dotnet echoplex.dll