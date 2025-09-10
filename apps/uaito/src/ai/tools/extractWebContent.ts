import {  Page } from 'playwright';


export async function extractAllText(page: Page, customSelector?: string): Promise<string> {
  return await page.evaluate((selector) => {
    const ignoredTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'SVG'];
    const ignoredClasses = ['nav', 'navbar', 'header', 'footer', 'sidebar', 'ad', 'advertisement', 'menu'];
    
    function shouldIgnoreElement(element: Element): boolean {
      if (ignoredTags.includes(element.tagName)) return true;
      
      for (const className of ignoredClasses) {
        if (element.classList.contains(className) || element.id.toLowerCase().includes(className)) {
          return true;
        }
      }
      
      return false;
    }

    function extractTextFromElement(element: Element): string {
      if (shouldIgnoreElement(element)) return '';

      let text = '';
      for (const child of Array.from(element.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
          const trimmedText = (child.textContent || '').trim();
          if (trimmedText) {
            text += trimmedText + ' ';
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          text += extractTextFromElement(child as Element);
        }
      }
      return text.trim();
    }

    let rootElement: Element | null;
    if (selector) {
      rootElement = document.querySelector(selector);
      if (!rootElement) {
        console.warn(`Custom selector "${selector}" not found. Falling back to body.`);
        rootElement = document.body;
      }
    } else {
      rootElement = document.body;
    }

    return extractTextFromElement(rootElement).trim().replace(/\s+/g, ' ');
  }, customSelector);
}

