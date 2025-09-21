// utils/markdownParser.ts
import type { RIDBProps } from '@/types';
import React, { ReactNode } from 'react';


export function reactNodeToString(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    // If the node is a string or number, return it as a string.
    return node.toString();
  }

  if (node == null || typeof node === 'boolean') {
    // If the node is null, undefined, or a boolean, return an empty string.
    return '';
  }

  if (Array.isArray(node)) {
    // If the node is an array, recursively convert each element and join them.
    return node.map(reactNodeToString).join('');
  }

  if (React.isValidElement(node)) {
    // If the node is a valid React element, recursively convert its children.
    return reactNodeToString(node.props.children);
  }

  // If the node is an object (e.g., a React fragment), try to access its children.
  if (typeof node === 'object' && node !== null && 'props' in node) {
    const props = node.props as { children?: ReactNode };
    if ('children' in props) {
      return reactNodeToString(props.children);
    }
  }

  // For any other types (e.g., functions, symbols), return an empty string.
  return '';
}
export const parseMarkdown = async (
  origin: string,
    location:string,
    path: string
): Promise<RIDBProps> => {
  const url = `${origin}/${path}`;
  console.log(url);
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`Failed to fetch: ${url}`, response.status);
    throw new Error(`Failed to fetch: ${url}`);
  }

  let content = await response.text();

  const locations = location.split("/");
  locations.pop();

  // Regex to replace relative links (e.g., [text](file.md))
  if (!content.includes("cdn.jsdelivr.net")) { 
    content = content.replace(
      /\((?!https?:\/\/)github\.com\/elribonazo\/uaito([^)]+)\.md\)/g,
      `(/docs/${locations.join("/")}/$1.md)`
    );
  }

  // Updated regex to replace absolute GitHub links to Markdown files
  content = content.replace(
    /\((https?:\/\/github\.com\/elribonazo\/uaito\/(?:blob|tree)\/main\/docs\/([^)]+\.md))\)/g,
    `(/docs/$1)`
  );

  content = content.replace(
    /\/docs\/docs\//g,
    '/docs/'
  );

  content = content.replace(/_media(.*)/, "$1")
  content = content.replace("docs/docs/", "docs/");
  
  // Use regex to match headings
  const headingRegex = /^(\#{1,6})\s+(.+)$/gm;

  const headings: { level: number; title: string; index: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const index = match.index;
    headings.push({ level, title, index });
  }

  const sections: { level: number; title: string; content: string }[] = [];
  for (let i = 0; i < headings.length; i++) {
    const start = headings[i].index;
    const end = i + 1 < headings.length ? headings[i + 1].index : content.length;
    const sectionContent = content.substring(start, end).trim();
    sections.push({
      level: headings[i].level,
      title: headings[i].title,
      content: sectionContent
    });
  }

  // Build menu structure
  const buildMenuStructure = (sections: { level: number; title: string; content: string }[]) => {
    const menu: { title: string; level: number; subMenus: any[] }[] = [];
    const stack: { title: string; level: number; subMenus: any[] }[] = [];

    sections.forEach((section) => {
      const item = {
        title: section.title,
        level: section.level,
        subMenus: [],
      };

      while (
        stack.length > 0 &&
        section.level <= stack[stack.length - 1].level
      ) {
        stack.pop();
      }

      if (stack.length === 0) {
        menu.push(item);
      } else {
        const parent = stack[stack.length - 1];
        parent.subMenus.push(item);
      }

      stack.push(item);
    });

    // Clean up empty subMenus
    const cleanMenu = (menuItems: { title: string; level: number; subMenus?: any[] }[]) => {
      return menuItems.map((item) => {
        if (item.subMenus && item.subMenus.length === 0) {
          delete item.subMenus;
        } else if (item.subMenus) {
          item.subMenus = cleanMenu(item.subMenus);
        }
        return item;
      });
    };

    return cleanMenu(menu);
  };

  const structuredMenu = buildMenuStructure(sections);

  return {
    sections,
    structuredMenu,
  };
};
