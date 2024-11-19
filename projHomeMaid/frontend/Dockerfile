# Stage 1: Build the application with Node.js
FROM node:18-alpine3.17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files first to install dependencies
COPY package.json package-lock.json ./

# Install the dependencies (including axios)
RUN npm install

# Copy the rest of your application files into the container
COPY . .

# Expose the necessary port (for your dev server)
EXPOSE 5173

# Command to run the application (dev server in this case)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
