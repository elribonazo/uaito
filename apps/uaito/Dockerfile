# Stage 1: Base image for installing dependencies
FROM node:20-slim as base
WORKDIR /app

# Enable corepack and set correct yarn version
RUN corepack enable
RUN corepack prepare yarn@4.9.1 --activate

# Copy root package.json and yarn.lock for workspace setup
COPY package.json yarn.lock ./

# Copy only necessary workspace package.json files for the site
COPY packages/build/package.json ./packages/build/
COPY packages/sdk/package.json ./packages/sdk/
COPY apps/uaito/package.json ./apps/uaito/


# Stage 2: Builder stage for building the application
FROM base as builder
WORKDIR /app

# Install all workspace dependencies
# Use cache mount to speed up subsequent builds
RUN --mount=type=cache,target=/root/.yarn/berry/cache yarn install

# Copy the entire monorepo source code
COPY . .

# Build the required packages
RUN yarn workspace @uaito/build build
RUN yarn workspace @uaito/sdk build
RUN yarn workspace @uaito/site build


# Stage 3: Production image
FROM node:20-slim as runner
WORKDIR /app

ENV NODE_ENV=production

# Set environment variables for production
# These can be passed at build time and overridden at runtime
ARG MAX_TOKENS
ENV MAX_TOKENS=${MAX_TOKENS}
ARG ANTHROPIC_API_KEY
ENV ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ARG GCLIENT_ID
ENV GCLIENT_ID=${GCLIENT_ID}
ARG GCLIENT_SECTET
ENV GCLIENT_SECTET=${GCLIENT_SECTET}
ARG MONGODB_URL
ENV MONGODB_URL=${MONGODB_URL}
ARG GODS
ENV GODS=${GODS}
ARG GITHUB_OWNER
ENV GITHUB_OWNER=${GITHUB_OWNER}
ARG GITHUB_REPO
ENV GITHUB_REPO=${GITHUB_REPO}
ARG GITHUB_PAT
ENV GITHUB_PAT=${GITHUB_PAT}
ARG ENDPOINT
ENV ENDPOINT=${ENDPOINT}
ARG NEXT_PUBLIC_MAX_TOKENS
ENV NEXT_PUBLIC_MAX_TOKENS=${NEXT_PUBLIC_MAX_TOKENS}

# Enable corepack and set correct yarn version
RUN corepack enable
RUN corepack prepare yarn@4.9.1 --activate

# Copy dependency manifests from the builder stage
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/packages/build/package.json ./packages/build/
COPY --from=builder /app/packages/sdk/package.json ./packages/sdk/
COPY --from=builder /app/apps/uaito/package.json ./apps/uaito/

# Copy built dependency packages from the builder
COPY --from=builder /app/packages/build/build ./packages/build/build
COPY --from=builder /app/packages/sdk/build ./packages/sdk/build

# Install only production dependencies
RUN --mount=type=cache,target=/root/.yarn/berry/cache yarn install --production

# Copy the built Next.js app from the builder
COPY --from=builder /app/apps/uaito/.next ./apps/uaito/.next
COPY --from=builder /app/apps/uaito/public ./apps/uaito/public
COPY --from=builder /app/apps/uaito/next.config.ts ./apps/uaito/
# We need package.json for next start to find dependencies
COPY --from=builder /app/apps/uaito/package.json ./apps/uaito/

WORKDIR /app/apps/uaito

EXPOSE 3000

# Start the Next.js application
CMD ["npx", "next", "start"] 

