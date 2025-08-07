# Stage 1: Build the React app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the build output via NGINX
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# custom config copied in container
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
