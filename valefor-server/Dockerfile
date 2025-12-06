FROM node:24

WORKDIR /app

COPY package*.json .

# During image build
RUN npm install

COPY . .

EXPOSE 3000

# During container run
CMD ["npm", "run", "start:dev"]
