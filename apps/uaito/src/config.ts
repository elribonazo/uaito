import { AgentTypeToOptions } from '@uaito/sdk';
import dotenv from 'dotenv';

dotenv.config();

export const safeCommands = process.env.SAFE_COMMANDS?.split(",") ?? [
    'mkdir', 'cd', 'git', 'npm', 'rm', 'for',
    'npx', 'grep', 'find', 'cp', 'ls',
]

function getModel(boost: boolean) {
  return boost ? 
  'claude-3-5-sonnet-20240620':
  'claude-3-haiku-20240307'
}

function getMaxTokens(boost: boolean) {
  return boost ? 
  8192:
  4096
}

const boost = true;
const defaultModel = getModel(boost);
const defaultMaxTokens = getMaxTokens(boost);

export const baseAgentConfig: AgentTypeToOptions[keyof AgentTypeToOptions] = {
  apiKey: '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',
  model: defaultModel,
  maxTokens: defaultMaxTokens,
}

export const config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://root:default12345@localhost:27017/admin',
};


