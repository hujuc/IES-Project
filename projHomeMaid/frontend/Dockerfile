# Stage 1: Build the application with Node.js
FROM node:18-alpine3.17 AS build

# Set the working directory
WORKDIR /app

# Copy the source files
COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Install dependencies and build the application
CMD npm run dev -- --host 0.0.0.0
