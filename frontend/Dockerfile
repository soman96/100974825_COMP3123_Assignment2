FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# Start React dev server
CMD ["npm", "start"]
