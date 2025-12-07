FROM node:24

WORKDIR /app

COPY package*.json .

# During image build
RUN npm install

COPY . .

EXPOSE 3000

# During container run
CMD ["sh", "-c", "npm run db:deploy && npm run start:dev"]
