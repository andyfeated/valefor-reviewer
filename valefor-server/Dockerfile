FROM node:24-slim

WORKDIR /app

RUN apt-get update && apt-get install -y procps openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json .

# During image build
RUN npm install

COPY . .

EXPOSE 3000

# During container run
CMD ["sh", "-c", "npm run db:deploy && npm run start:dev"]
