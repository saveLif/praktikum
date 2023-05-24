FROM node:14 AS build

# Create app directory
RUN mkdir /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Install the Angular CLI
RUN npm install -g @angular/cli@14.2.1

# Copy the rest of the app files
COPY . .

# Build the app
RUN ng build 


FROM nginx:latest

COPY --from=build /app/dist/baum /usr/share/nginx/html
COPY nginx.conf /etc/ngnix/conf.d/default.conf


# Expose the port the app runs on
EXPOSE 80

# Start the app



