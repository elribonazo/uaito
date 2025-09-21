import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { reactNodeToString } from '@/utils/markdownParser';
interface SectionRendererProps {
  section: {
    title: string;
    content: string;
  };
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  return (
    <section
      id={section.title.toLowerCase().replace(/\s+/g, '-')}
      className="mb-4 scroll-mt-6 prose prose-invert max-w-none fade-in overflow-x-hidden  my-5"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            if (match && match[1] !== 'text') {
              return (
                <CodeBlock
                  language={match[1]}
                  code={String(children).replace(/\n$/, '')}
                />
              );
            }
            return <code {...props}>{children}</code>;
          },
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-gray-100 mt-18 border-b border-gray-700 pb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-gray-200  mt-18 border-b border-gray-800 pb-1">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-gray-300  mt-18">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-medium text-gray-400  mt-18">{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-medium text-gray-400  mt-18">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-medium text-gray-500  mt-18">{children}</h6>
          ),
          p: ({ children }) => <p className="text-gray-300 leading-relaxed">{children}</p>,
          blockquote: ({ children }) => (
            <CodeBlock language={'typescript'} code={reactNodeToString(children)} />
          ),
          a: ({ children, href, ...props }) => (
            <a 
              href={href} 
              className="text-gray-300 hover:text-white underline decoration-gray-500 hover:decoration-gray-300 transition-colors duration-200" 
              {...props}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-300 space-y-1 ml-4">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300">{children}</li>
          ),
        }}
      >
        {section.content}
      </ReactMarkdown>
    </section>
  );
};

export default SectionRenderer;
