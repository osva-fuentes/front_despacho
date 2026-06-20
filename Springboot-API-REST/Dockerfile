# ---------- Stage 1: build con Maven ----------
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copiamos primero el pom.xml para aprovechar el cache de Docker:
# si no cambian las dependencias, no se vuelven a descargar en cada build
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Ahora copiamos el código fuente y compilamos
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---------- Stage 2: imagen final, solo el JRE ----------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiamos el .jar generado en el stage anterior
# (el nombre exacto depende del artifactId+version del pom, usamos wildcard)
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
