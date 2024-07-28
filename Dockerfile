FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
COPY src/config/queries.json dist/config/queries.json
CMD ["sh", "-c", "npm run setupDatabase && npm start"]
