FROM node:22.12-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22.12-alpine AS production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
RUN npm install -g http-server
EXPOSE 5173
ENV NODE_ENV=production
CMD ["http-server", "dist", "-p", "5173", "--proxy", "http://localhost:5173?"]
