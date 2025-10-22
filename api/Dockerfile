# Use Node LTS as the base image
FROM node:lts

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Expose API port
EXPOSE 4000

# Run the development server
CMD ["npm", "run", "dev"]
