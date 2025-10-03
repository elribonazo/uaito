# Stage 1: Build the monorepo
FROM node:20
WORKDIR /app

RUN npx playwright install-deps    
RUN npx playwright install

# Set environment variables
ARG MAX_TOKENS
ENV MAX_TOKENS=${MAX_TOKENS}
ARG ANTHROPIC_API_KEY
ENV ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ARG GOOGLE_API_KEY
ENV GOOGLE_API_KEY=${GOOGLE_API_KEY}
ARG GROK_API_KEY
ENV GROK_API_KEY=${GROK_API_KEY}
ARG TAVILY_API_KEY
ENV TAVILY_API_KEY=${TAVILY_API_KEY}
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

# Enable corepack and set correct yarn version
RUN corepack enable
RUN corepack prepare yarn@4.9.1 --activate

# Copy root package.json and yarn.lock for workspace setup
COPY package.json yarn.lock .yarnrc.yml ./

# Copy all workspace package.json files for proper dependency resolution
COPY packages/ai/package.json ./packages/ai/
COPY packages/anthropic/package.json ./packages/anthropic/
COPY packages/api/package.json ./packages/api/
COPY packages/build/package.json ./packages/build/
COPY packages/huggingFace/package.json ./packages/huggingFace/
COPY packages/openai/package.json ./packages/openai/
COPY packages/google/package.json ./packages/google/
COPY packages/sdk/package.json ./packages/sdk/
COPY apps/uaito/package.json ./apps/uaito/


# Install all workspace dependencies
RUN yarn install --immutable

# Copy the entire monorepo source code
COPY . .

# Build the SDK package first (required by the site)
RUN yarn build

WORKDIR /app/apps/uaito

EXPOSE 3000


CMD GODS=${GODS} MONGODB_URL=${MONGODB_URL} GCLIENT_ID=${GCLIENT_ID} GCLIENT_SECTET=${GCLIENT_SECTET} ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY} NEXT_PUBLIC_MAX_TOKENS=${NEXT_PUBLIC_MAX_TOKENS} MAX_TOKENS=${MAX_TOKENS} OPENAI_API_KEY=${OPENAI_API_KEY} npx next start 

