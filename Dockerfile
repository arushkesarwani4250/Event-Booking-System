# Use an official, lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy all inside files (except those inside .dockerignore) to the container
COPY . .

# Open port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
