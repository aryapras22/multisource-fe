# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set Vite build arguments
ARG VITE_MULTISOURCE_SERVICE_API_ENDPOINT
ARG VITE_API_KEY
ENV VITE_MULTISOURCE_SERVICE_API_ENDPOINT=$VITE_MULTISOURCE_SERVICE_API_ENDPOINT
ENV VITE_API_KEY=$VITE_API_KEY

# Build for production
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]