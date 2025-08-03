# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /reactservice

COPY package.json package-lock.json* ./
RUN npm install

COPY public ./public
COPY src ./src
COPY index.html ./index.html
COPY vite.config.js ./vite.config.js
RUN npm run build

# Stage 2: Create minimal runtime image - Deploy via nginx
FROM nginx:alpine

COPY --from=builder /reactservice/dist /usr/share/nginx/html

# Replace default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
