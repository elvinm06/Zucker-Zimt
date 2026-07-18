# --- build: needs devDependencies (nest CLI, TypeScript) ---
FROM node:22-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- run: production dependencies only ---
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Uploaded images are written here at runtime; compose mounts a volume over it
# so they survive container rebuilds.
RUN mkdir -p uploads

EXPOSE 4000
CMD ["node", "dist/main"]
