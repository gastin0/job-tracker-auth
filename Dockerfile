# 1. Base image
FROM node:20-alpine AS base
WORKDIR /app

# 2. Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# 3. Copy project files
COPY . .

# 4. Build Next.js
RUN npm run build

# 5. Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app ./

EXPOSE 3000

CMD ["npm", "start"]
