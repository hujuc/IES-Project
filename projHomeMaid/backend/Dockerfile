FROM maven:3.8.5-openjdk-17 AS build

WORKDIR /backend
COPY . /backend

RUN mvn clean install -DskipTests

FROM openjdk:17-jdk-slim

COPY --from=build /backend/target/*.jar /backend/app.jar

EXPOSE 8080

CMD ["java", "-jar", "/backend/app.jar"]