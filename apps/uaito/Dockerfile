# Stage 1: Build the monorepo
FROM node:20
WORKDIR /app

# Enable corepack and set correct yarn version
RUN corepack enable
RUN corepack prepare yarn@4.9.1 --activate

# Copy root package.json and yarn.lock for workspace setup
COPY package.json yarn.lock ./

# Copy all workspace package.json files for proper dependency resolution
COPY packages/sdk/package.json ./packages/sdk/
COPY apps/uaito/package.json ./apps/uaito/
COPY apps/electron/package.json ./apps/electron/
COPY playground/nextjs/package.json ./playground/nextjs/
COPY playground/node/package.json ./playground/node/

# Install all workspace dependencies
RUN yarn

# Install playwright with deps for the uaito app
RUN npx -y playwright@1.46.0 install --with-deps
RUN npx playwright install

# Copy the entire monorepo source code
COPY . .

# Build the SDK package first (required by the site)
RUN yarn workspace @uaito/sdk run build

# Build the site
WORKDIR /app/apps/uaito

# Set environment variables
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

RUN yarn build
EXPOSE 3000

CMD GODS=${GODS} MONGODB_URL=${MONGODB_URL} GCLIENT_ID=${GCLIENT_ID} GCLIENT_SECTET=${GCLIENT_SECTET} ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY} NEXT_PUBLIC_MAX_TOKENS=${NEXT_PUBLIC_MAX_TOKENS} MAX_TOKENS=${MAX_TOKENS} OPENAI_API_KEY=${OPENAI_API_KEY} npx next start 

