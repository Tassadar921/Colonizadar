# Use official Node.js image as the base image
FROM node:22

# Set working directory inside the container
WORKDIR /app/back

# Copy package.json and package-lock.json first (to leverage Docker cache)
COPY back/package.json back/package-lock.json ./

# Install dependencies (including production dependencies)
RUN npm install --production

# Copy the rest of the application
COPY back ./

# Ensure node_modules directory is not overwritten by host volume
RUN chown -R node:node /app/back

# Expose the port AdonisJS will run on
EXPOSE 3333

# Use a non-root user for better security practices
USER node

# Run AdonisJS application
CMD ["node", "ace", "serve", "--host", "0.0.0.0"]
