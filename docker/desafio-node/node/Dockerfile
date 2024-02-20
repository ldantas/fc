#Dockerfile Node
FROM node:lts-buster-slim

RUN apt-get update && apt-get install curl -y

WORKDIR /usr/src/app

COPY . . 

EXPOSE 3000

CMD ["node", "index.js"]