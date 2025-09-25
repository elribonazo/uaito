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
            return <code className="text-pink-400 bg-gray-800 px-1 py-0.5 rounded">{children}</code>;
          },
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-white mt-12 mb-6 border-b border-gray-700 pb-3">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-gray-100 mt-10 mb-5 border-b border-gray-800 pb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-gray-200 mt-8 mb-4">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-medium text-gray-300 mt-6 mb-3">{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base font-medium text-gray-400 mt-4 mb-2">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-medium text-gray-500 mt-2 mb-1">{children}</h6>
          ),
          p: ({ children }) => <p className="text-gray-300 leading-relaxed my-4">{children}</p>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-600 pl-4 my-4">
              <CodeBlock language={'typescript'} code={reactNodeToString(children)} />
            </blockquote>
          ),
          a: ({ children, href, ...props }) => (
            <a 
              href={href} 
              className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
              {...props}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 my-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-300 space-y-2 ml-4 my-4">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300 py-1">{children}</li>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 border border-gray-700 rounded-lg">
              <table className="w-full text-sm text-left text-gray-400">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="text-xs uppercase bg-gray-700 text-gray-400">{children}</thead>
          ),
          tr: ({ children }) => (
            <tr className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">{children}</tr>
          ),
          td: ({ children }) => <td className="px-6 py-4">{children}</td>,
          th: ({ children }) => (
            <th scope="col" className="px-6 py-3 text-left">
              {children}
            </th>
          ),
        }}
      >
        {section.content}
      </ReactMarkdown>
    </section>
  );
};

export default SectionRenderer;
