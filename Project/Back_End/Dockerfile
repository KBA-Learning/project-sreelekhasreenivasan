FROM node:20.15.1
WORKDIR /usr/src/index
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node","index.js"]