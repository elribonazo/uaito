// Storage configuration for Redux persistence
export const STORAGE_CONFIG = {
  // Maximum number of chats to keep in storage
  MAX_CHATS: 10,
  
  // Maximum number of messages per chat to persist
  MAX_MESSAGES_PER_CHAT: 20,
  
  // Throttle time for persistence (ms)
  PERSIST_THROTTLE: 1000,
  
  // Auto-cleanup threshold - when chat count exceeds this, trigger cleanup
  AUTO_CLEANUP_THRESHOLD: 15,
  
  // Number of chats to keep during auto-cleanup
  AUTO_CLEANUP_KEEP_COUNT: 10,
} as const;

export type StorageConfig = typeof STORAGE_CONFIG;

