FROM node:18-alpine

# Set the working directory to the app folder, which contains
# the routes for each page.
WORKDIR /app

# Copy the contents from the package.json and package-lock.json files.
COPY package*.json ./

# Run the npm install command to install dependencies
# from package.json file.
RUN npm install

# Copies files from root directory so that they can be used
# when deploying the Docker image.
COPY . .

# Expose the port in which the container is going
# to be running from.
EXPOSE 3000

# Run the Next.js app on localhost.
CMD npm run dev