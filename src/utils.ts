import { MessageInput, Role } from "./types";

function isValidRole(role: any): role is Role {
  return role === 'assistant' || role === 'user';
}

function isValidMessageContent(content: any): boolean {
  if (typeof content !== 'object' || content === null) {
    return false;
  }

  switch (content.type) {
    case 'text':
      return typeof content.text === 'string';
    case 'image':
      return typeof content.source === 'object' 
        && typeof content.source.data === 'string'
        && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(content.source.media_type)
        && content.source.type === 'base64';
    case 'tool_start':
    case 'tool_use':
      return typeof content.id === 'string'
        && typeof content.name === 'string'
        && content.input !== undefined;
    case 'tool_delta':
      return typeof content.partial === 'string';
    case 'tool_result':
      return typeof content.tool_use_id === 'string'
        && typeof content.name === 'string'
        && (Array.isArray(content.content) || content.content === undefined)
        && (typeof content.isError === 'boolean' || content.isError === undefined);
    case 'delta':
      return ['end_turn', 'max_tokens', 'stop_sequence', 'tool_use', null].includes(content.stop_reason)
        && (typeof content.stop_sequence === 'string' || content.stop_sequence === null);
    case 'usage':
      return (typeof content.input === 'number' || content.input === undefined)
        && (typeof content.output === 'number' || content.output === undefined);
    case 'error':
      return typeof content.message === 'string';
    default:
      return false;
  }
}

function validateMessageInput(item: any): item is MessageInput {
  if (typeof item !== 'object' || item === null) {
    console.error('Invalid message input: must be an object');
    return false;
  }

  if (!isValidRole(item.role)) {
    console.error(`Invalid role: ${item.role}. Must be either 'assistant' or 'user'`);
    return false;
  }

  if (!Array.isArray(item.content)) {
    console.error('Invalid content: must be an array');
    return false;
  }

  for (let i = 0; i < item.content.length; i++) {
    if (!isValidMessageContent(item.content[i])) {
      console.error(`Invalid content at index ${i}: ${JSON.stringify(item.content[i])}`);
      return false;
    }
  }

  return true;
}

export class MessageArray<T extends MessageInput> extends Array<T> {
  constructor(items: T[] = []) {
    super(...items);
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop === 'push') {
          return function (...items: T[] | T[][]): number {
            for (let item of items) {
              if (Array.isArray(item)) {
                for (let im of item) {
                  if (validateMessageInput(im)) {
                    const lastOne = target[target.length - 1];
                    const isSameRole = lastOne?.role === im.role && im.role === "user";
                    if (isSameRole) {
                      if (Array.isArray(lastOne.content) && Array.isArray(im.content)) {
                        Array.prototype.push.call(lastOne.content, ...im.content);
                      } else {
                        Array.prototype.push.call(target, im);
                      }
                    } else {
                      Array.prototype.push.call(target, im);
                    }
                  } else {
                    console.error('Invalid message input, skipping:', im);
                  }
                }
              } else {
                if (validateMessageInput(item)) {
                  const lastOne = target[target.length - 1];
                  const isSameRole = lastOne?.role === item.role && item.role === "user";
                  if (isSameRole) {
                    if (Array.isArray(lastOne.content) && Array.isArray(item.content)) {
                      Array.prototype.push.call(lastOne.content, ...item.content);
                    } else {
                      Array.prototype.push.call(target, item);
                    }
                  } else {
                    Array.prototype.push.call(target, item);
                  }
                } else {
                  console.error('Invalid message input, skipping:', item);
                }
              }
            }
            return target.length;
          };
        }
        return Reflect.get(target, prop, receiver);
      }
    });
  }
}