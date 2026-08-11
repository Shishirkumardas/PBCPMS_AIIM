# Build from monorepo root so Render finds Dockerfile at /
# Backend sources live in PBCPMS_AIIM/

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

ENV SPRING_PROFILES_ACTIVE=render
EXPOSE 8080

# Render sets PORT; application-render.properties maps it to server.port
ENTRYPOINT ["java", "-jar", "app.jar"]
