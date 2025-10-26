import { v4 } from "uuid";
import type { MessageInput, Role } from "./domain/types";

/**
 * Validates if a given value is a valid `Role`.
 * A valid role is one of 'assistant', 'user', 'system', or 'tool'.
 * @param {any} role - The value to validate.
 * @returns {role is Role} `true` if the role is a valid `Role`, otherwise `false`.
 */
function isValidRole(role: any): role is Role {
  return role === 'assistant' || role === 'user' || role === 'system' || role === 'ipython';
}

/**
 * Validates if a given object is a valid `MessageContent` block.
 * This function checks the `type` property and validates the corresponding fields for each block type.
 * @param {any} content - The content object to validate.
 * @returns {boolean} `true` if the content is a valid block, otherwise `false`.
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
    case 'file':
      return typeof content.source === 'object'
        && typeof content.source.name === 'string'
        && typeof content.source.content === 'string'
        && ['text/plain', 'text/markdown', 'text/csv', 'application/json'].includes(content.source.media_type)
        && content.source.type === 'string';
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
 * Validates a `MessageInput` object, ensuring it has a valid role and content.
 * If the object does not have an `id`, a new UUID is generated for it.
 * @param {any} item - The object to validate.
 * @returns {item is MessageInput} `true` if the object is a valid `MessageInput`, otherwise `false`.
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
 * A specialized array class for managing an array of `MessageInput` objects.
 * It extends the native `Array` but overrides the `push` method to automatically
 * validate and merge consecutive messages from the same user role.
 *
 * @class MessageArray
 * @extends {Array<T>}
 * @template T - The type of message, which must extend `MessageInput`.
 *
 * @example
 * ```typescript
 * const messages = new MessageArray();
 * messages.push({ role: 'user', content: [{ type: 'text', text: 'Hello' }] });
 * messages.push({ role: 'user', content: [{ type: 'text', text: ' world!' }] });
 * // messages will contain a single message with content "Hello world!"
 * ```
 */
export class MessageArray<T extends MessageInput> extends Array<T> {

  /**
   * A static factory method to create a `MessageArray` from an array of `MessageInput` items.
   * @param {MessageInput[]} items - The items to create the `MessageArray` from.
   * @returns {MessageArray<MessageInput>} A new `MessageArray` instance.
   */
  static from(items: MessageInput[]): MessageArray<MessageInput> {
    return new MessageArray(items);
  }

  /**
   * Creates an instance of `MessageArray`.
   * It uses a `Proxy` to intercept the `push` method, enabling custom logic for
   * validating and merging messages before they are added to the array.
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
   * Determines whether a new message should be merged with the previous one.
   * Merging occurs if both messages are from the 'user' and the new message does not contain a tool result.
   * This is useful for combining consecutive user text inputs into a single message.
   * @protected
   * @param {T} lastOne - The last message in the array.
   * @param {T} item - The new message to be added.
   * @returns {boolean} `true` if the messages should be merged, otherwise `false`.
   */
  protected isSameRole(lastOne: T, item: T): boolean {
    const isTool = item.content.some((c) => c.type === 'tool_result');
    return lastOne?.role === item.role && item.role === "user" && !isTool;
  }
}
