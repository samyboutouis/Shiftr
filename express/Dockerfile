FROM node:14.7

RUN echo hello
RUN mkdir /app
WORKDIR /app
ADD package.json .
ADD package-lock.json .
RUN npm install
ADD . .

