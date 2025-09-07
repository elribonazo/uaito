
import type { Tool } from "../app/Chat";

export const getCurrentDate: Tool = {
    "name": "get_current_date",
    "description": "Returns the current date in the format specified",
    "input_schema": {
      type: "object",
      required: ["format"],
      properties: {
        format: {
          type: "string",
          description: "will format the date in the format specified MM/DD/YY or similar"
        }
      }
    },
    "code": `/**
 * Returns the current date in the specified format.
 * @param {string} format - The format string (e.g., "YYYY-MM-DD", "MM/DD/YYYY")
 * @returns {string} The formatted current date
 */
export function get_current_date(format) {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');

  return format
    .replace("YYYY", year)
    .replace("YY", year.slice(-2))
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hour)
    .replace("mm", minute)
    .replace("ss", second);
}`,
    "enabled": true
  }

const randomNumber: Tool = {
    "name": "random_number",
    "description": "Generates a random number between min and max (inclusive)",
    "input_schema": {
      type: "object",
      required: ["min", "max"],
      properties: {
        min: {
          type: "number",
          description: "The minimum value (inclusive)"
        },
        max: {
          type: "number", 
          description: "The maximum value (inclusive)"
        }
      }
    },
    "code": `/**
 * Generates a random number between min and max (inclusive).
 * @param {number} min - The minimum value (inclusive)
 * @param {number} max - The maximum value (inclusive)
 * @returns {number} A random number between min and max
 */
export function random_number(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}`,
    "enabled": true
  }

export const tools: Tool[] = [getCurrentDate, randomNumber]
