# Stage 1: Build the application
FROM node:22-alpine AS builder
# Integration function start: Auth
ARG VITE_AUTH_API_BASE_URL
ENV VITE_AUTH_API_BASE_URL=$VITE_AUTH_API_BASE_URL
# Integration function end: Auth
# Integration function start: Email
ENV VITE_EMAIL_API_BASE_URL=$VITE_EMAIL_API_BASE_URL
ARG VITE_EMAIL_API_BASE_URL
# Integration function end: Email
# Integration function start: File
ENV VITE_FILE_API_BASE_URL=$VITE_FILE_API_BASE_URL
ARG VITE_FILE_API_BASE_URL
# Integration function end: File
# Integration function start: Vault
ENV VITE_VAULT_API_BASE_URL=$VITE_VAULT_API_BASE_URL
ARG VITE_VAULT_API_BASE_URL
# Integration function end: Vault
# Integration function start: Gateway
ENV VITE_GATEWAY_BASE_URL=$VITE_GATEWAY_BASE_URL
ARG VITE_GATEWAY_BASE_URL
# Integration function end: Gateway

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
