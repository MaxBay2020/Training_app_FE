# Use the official Node.js image as the base image
FROM node:16 AS build

# Set the working directory in the container
WORKDIR /training_app_fe

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the production version of the React app
RUN npm run build

# Use Nginx to serve the built static files
FROM nginx:alpine

# Copy the build folder from the previous stage into Nginx's public directory
COPY --from=build /training_app_fe/build /usr/share/nginx/html

# Expose the container's port 80
EXPOSE 80

# Start Nginx service
CMD ["nginx", "-g", "daemon off;"]
