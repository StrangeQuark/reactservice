FROM node:20-alpine

WORKDIR /reactservice

COPY public ./public
COPY src ./src
COPY package.json ./

ENV PORT=6000
EXPOSE 6000

RUN npm install

CMD ["npm", "start"]