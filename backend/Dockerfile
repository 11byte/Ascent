FROM node:24-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
