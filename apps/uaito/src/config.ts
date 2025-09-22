import dotenv from 'dotenv';

dotenv.config();

export const UAITO_DOCS_ORIGIN = 'https://raw.githubusercontent.com/elribonazo/uaito/refs/heads/main'

export const safeCommands = process.env.SAFE_COMMANDS?.split(",") ?? [
    'mkdir', 'cd', 'git', 'npm', 'rm', 'for',
    'npx', 'grep', 'find', 'cp', 'ls',
]

export const config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://root:default12345@localhost:27017/admin',
};


