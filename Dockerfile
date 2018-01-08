FROM node:8.6.0

ARG cwd=/

RUN mkdir -p $cwd
WORKDIR $cwd

# copy package.json for npm install
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .
