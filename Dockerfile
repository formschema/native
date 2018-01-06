FROM node:8.6.0

# copy package.json for npm install
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install -g nodemon
RUN npm install

COPY . .
