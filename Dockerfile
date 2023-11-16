FROM node:current-alpine3.17

# Set the working directory
WORKDIR /app

RUN apk add --no-cache python3 make

RUN npm install -g pnpm

COPY ./prisma ./prisma

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]