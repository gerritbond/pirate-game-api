# Stage 0: Prepare the base container
FROM node:22-bullseye-slim AS base

# Install required packages and security updates and clean up
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


# Stage 1: Build the application
FROM base AS builder

# Set the working directory in the container
WORKDIR /src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create a new stage for the production build
FROM base

# Set the working directory in the container
WORKDIR /src/app

# Install security updates and clean up
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* 

# Copy the build from the previous stage
COPY --from=builder /src/app/dist ./dist
COPY --from=builder /src/app/package.json ./package.json
COPY --from=builder /src/app/package-lock.json ./package-lock.json
# Install only the production dependencies
RUN npm ci --only=production

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]