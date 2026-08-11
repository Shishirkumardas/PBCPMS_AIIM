# Build from monorepo root so Render finds Dockerfile at /
# Backend sources live in PBCPMS_AIIM/
# Active config: application.properties (env: DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET)

# ---- build ----
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY PBCPMS_AIIM/pom.xml .
COPY PBCPMS_AIIM/src ./src
RUN mvn -B -DskipTests package

# ---- run ----
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

RUN groupadd --system app && useradd --system --gid app app
COPY --from=build /app/target/*.jar app.jar
RUN chown app:app app.jar

USER app

EXPOSE 8080

# Render sets PORT; application.properties uses server.port=${PORT:8080}
ENTRYPOINT ["java", "-jar", "app.jar"]
