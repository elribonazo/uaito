import type { GetServerSideProps } from 'next';
import { parseMarkdown } from '@/utils/markdownParser';
import type { RIDBProps } from '@/types';

export interface DocumentationConfig {
  origin: string;
  docsPath?: string;
  defaultFile?: string;
  showMenuPattern?: RegExp;
  pathPrefix?: string;
}

export const createDocumentationServerSideProps = (
  config: DocumentationConfig
): GetServerSideProps<RIDBProps> => {
  return async (context) => {
    const slug = context.params?.slug as string[];
    const path = slug ? slug.join('/') : '';
    const asPath = context.resolvedUrl;
    
    // Clean the path based on config
    const cleanedPath = config.pathPrefix 
      ? path.replace(new RegExp(`^${config.pathPrefix}/`), '').split('#')[0]
      : path.split('#')[0];
    
    // Determine if menu should be shown
    const showMenu = config.showMenuPattern
      ? !config.showMenuPattern.test(asPath)
      : true;

    try {
      // Build the full origin path
      const fullOrigin = config.docsPath 
        ? `${config.origin}${config.docsPath}`
        : config.origin;
        
      const { sections, structuredMenu } = await parseMarkdown(
        fullOrigin,
        path,
        config.defaultFile || cleanedPath
      );
      
      return {
        props: {
          sections,
          structuredMenu,
          showMenu,
          notFound: false,
        },
      };
    } catch (error) {
      // If parseMarkdown fails, return a notFound prop
      return {
        props: {
          sections: [],
          structuredMenu: [],
          showMenu,
          asPath,
        },
        notFound: true,
      };
    }
  };
};
