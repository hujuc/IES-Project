# Use uma imagem base do OpenJDK
FROM openjdk:21-jdk

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copie o JAR gerado pelo Maven para o container
COPY target/UserService-0.0.1-SNAPSHOT.jar app.jar

# Exponha a porta usada pelo serviço
EXPOSE 4003

# Comando para iniciar a aplicação Java
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
