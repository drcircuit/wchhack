FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /app
COPY . ./
RUN dotnet restore
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build-env /app/out .
COPY --from=build-env /app/challenges.yaml .
ENV ASPNETCORE_URLS http://*:80
EXPOSE 80
ENTRYPOINT [ "dotnet", "HackerPortal.dll" ]