# Use official Node.js image
FROM node:22

# Set working directory inside the container
WORKDIR /app/back

# Copy package.json and package-lock.json first (for caching layers)
COPY back/package.json back/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY back ./

# Expose the AdonisJS port
EXPOSE 3333

# Run AdonisJS
CMD ["node", "ace", "serve"]
