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
    return reactNodeToString((node as any).props.children);
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
      /\(@uaito([^)]+)\.md\)/g,
      `(/docs/@uaito$1.md)`
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
  
  // Use regex to match headings, including HTML h1-h6 tags
  const headingRegex = /^(#{1,6})\s+(.+)$|<(h([1-6]))[^>]*>(.*?)<\/h\4>/gim;

  const headings: { level: number; title: string; index: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(content)) !== null) {
    let level: number;
    let title: string;
    
    if (match[1]) {
      // Markdown heading
      level = match[1].length;
      title = match[2].trim();
    } else {
      // HTML heading
      level = parseInt(match[4], 10);
      // Strip any inner HTML tags from the title for the menu
      title = match[5].replace(/<[^>]*>/g, '').trim();
    }
    
    const index = match.index;
    headings.push({ level, title, index });
  }

  const sections: { level: number; title: string; content: string }[] = [];

  if (headings.length === 0) {
    if (content.trim()) {
      // If no headings, treat the whole file as a single section
      sections.push({
        level: 1, // Using level 1 as it's a main content block
        title: 'Content', // Generic title, won't be displayed if not in markdown
        content: content,
      });
    }
  } else {
    // Handle content before the first heading
    if (headings[0].index > 0) {
      const preContent = content.substring(0, headings[0].index).trim();
      if (preContent) {
        sections.push({
          level: 0, // Special level for content without a heading
          title: 'introduction', // Unique ID for the section
          content: preContent,
        });
      }
    }

    // Process sections based on headings
    for (let i = 0; i < headings.length; i++) {
      const start = headings[i].index;
      const end = i + 1 < headings.length ? headings[i + 1].index : content.length;
      const sectionContent = content.substring(start, end).trim();
      sections.push({
        level: headings[i].level,
        title: headings[i].title,
        content: sectionContent,
      });
    }
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

  const menuSections = sections.filter(s => s.level > 0);
  const structuredMenu = buildMenuStructure(menuSections);

  return {
    sections,
    structuredMenu,
  };
};
