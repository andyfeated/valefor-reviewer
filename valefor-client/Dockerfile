FROM node:24

WORKDIR /app

COPY package*.json .

# During image build
RUN npm install

COPY . .

EXPOSE 4000

# During container run
CMD ["npm", "run", "dev"]
