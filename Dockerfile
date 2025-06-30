FROM node:20-alpine

WORKDIR /reactservice

COPY public ./public
COPY src ./src
COPY package.json ./

ENV PORT=6080
EXPOSE 6080

RUN npm install

CMD ["npm", "start"]