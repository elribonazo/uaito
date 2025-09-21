import { v4 } from "uuid";
import { MessageInput, Role } from "./domain/types";

/**
 * Checks if a given role is a valid Role.
 * @param {any} role - The role to validate.
 * @returns {role is Role} True if the role is valid, false otherwise.
 */
function isValidRole(role: any): role is Role {
  return role === 'assistant' || role === 'user' || role === 'system' || role === 'ipython';
}

/**
 * Checks if a given content object is valid message content.
 * @param {any} content - The content to validate.
 * @returns {boolean} True if the content is valid, false otherwise.
 */
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
    case "thinking":
    case "redacted_thinking":
    case "signature_delta":
      return true;
    default:
      return false;
  }
}

/**
 * Validates a MessageInput object.
 * @param {any} item - The item to validate.
 * @returns {item is MessageInput} True if the item is a valid MessageInput, false otherwise.
 */
function validateMessageInput(item: any): item is MessageInput {
  const contentValid = item.content.every(isValidMessageContent);
  if (!item.id) {
    item.id = v4();
  }
  return item.role !== undefined &&
    item.content !== undefined && 
    isValidRole(item.role) && 
    contentValid;
}

/**
 * A specialized array class for managing messages, with validation and merging capabilities.
 * @class MessageArray
 * @extends {Array<T>}
 * @template T
 */
export class MessageArray<T extends MessageInput> extends Array<T> {

  /**
   * Creates a MessageArray from an array of MessageInput items.
   * @param {MessageInput[]} items - The items to create the MessageArray from.
   * @returns {MessageArray<MessageInput>} A new MessageArray instance.
   */
  static from(items: MessageInput[]): MessageArray<MessageInput> {
    return new MessageArray(items);
  }

  /**
   * Creates an instance of MessageArray.
   * @param {T[]} [items=[]] - The initial items for the array.
   */
  constructor(items: T[] = []) {
    super(...(Array.isArray(items) ? items : [items]));
    // biome-ignore lint/correctness/noConstructorReturn: okey
    return new Proxy(this, {
      get: (target: typeof this, prop:string | symbol, receiver: any) => {
        if (prop === 'push') {
          return  (...items: T[] | T[][]): number => {
            for (const item of items) {
              if (Array.isArray(item)) {
                for (const im of item) {
                  if (validateMessageInput(im)) {
                    const lastOne = target[target.length - 1];
                    if (this.isSameRole(lastOne, im)) {
                      if (Array.isArray(lastOne.content) && Array.isArray(im.content)) {
                        Array.prototype.push.call(lastOne.content, ...im.content);
                      } else {
                        Array.prototype.push.call(target, im);
                      }
                    } else {
                      Array.prototype.push.call(target, im);
                    }
                  } else {
                    console.error('Invalid Array message input, skipping:', im);
                  }
                }
              } else {
                if (validateMessageInput(item)) {
                  const lastOne = target[target.length - 1];
                  if (this.isSameRole(lastOne, item)) {
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

  /**
   * Checks if two messages have the same role and should be merged.
   * @protected
   * @param {T} lastOne - The last message in the array.
   * @param {T} item - The new message to be added.
   * @returns {boolean} True if the roles are the same and the messages should be merged, false otherwise.
   */
  protected isSameRole(lastOne: T, item: T): boolean {
    const isTool = item.content.some((c) => c.type === 'tool_result');
    return lastOne?.role === item.role && item.role === "user" && !isTool;
  }
}
