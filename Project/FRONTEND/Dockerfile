FROM node:20.15.1
WORKDIR /index
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
CMD ["npm","run","dev","--host"]
