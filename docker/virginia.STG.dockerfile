# Stage 1: Build the Angular application
FROM node:20 AS build

# Set Working Directory
WORKDIR /app

# Copy the entire project
COPY . ./

# Install dependencies and PM2
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build:staging

# Stage 2: Serve the application with Nginx and PM2
FROM nginx:alpine

# Install bash and Node.js (required for PM2)
RUN apk add --no-cache bash nodejs npm

# Install PM2 globally in the final stage
RUN npm install -g pm2

# Copy the built app from the build stage
COPY --from=build /app/dist/portfolioWebDevelopOso /app

# Expose port 443
EXPOSE 443

# Final CMD to run both Nginx and PM2
CMD ["/bin/bash", "-c", "pm2-runtime start /app/server/server.mjs"]
