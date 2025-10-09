import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { reactNodeToString } from '@/utils/markdownParser';
interface SectionRendererProps {
  section: {
    title: string;
    content: string;
    level: number;
  };
}

const SectionRenderer: FC<SectionRendererProps> = ({ section }) => {
  const isPreamble = section.level === 0;

  // Conditionally set the className to avoid applying prose styles to raw HTML
  const sectionClassName = isPreamble 
    ? "mb-4"
    : "mb-4 scroll-mt-6 prose prose-invert max-w-none fade-in overflow-x-hidden my-5";
  
  return (
    <section
      id={section.title.toLowerCase().replace(/\s+/g, '-')}
      className={sectionClassName}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code: ({ node: _node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            if (match && match[1] !== 'text') {
              return (
                <CodeBlock
                  language={match[1]}
                  code={String(children).replace(/\n$/, '')}
                />
              );
            }
            return <code className="text-accent bg-muted px-1 py-0.5 rounded">{children}</code>;
          },
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-primary-text mt-12 mb-6 border-b border-border pb-3">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-primary-text mt-10 mb-5 border-b border-muted pb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-primary-text mt-8 mb-4">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-medium text-primary-text mt-6 mb-3">{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base font-medium text-secondary-text mt-4 mb-2">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-medium text-tertiary-text mt-2 mb-1">{children}</h6>
          ),
          p: ({ children }) => <p className="text-secondary-text leading-relaxed my-4">{children}</p>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-border pl-4 my-4">
              <CodeBlock language={'typescript'} code={reactNodeToString(children)} />
            </blockquote>
          ),
          a: ({ children, href, ...props }) => (
            <a 
              href={href} 
              className="text-primary hover:text-primary-hover underline transition-colors duration-200"
              {...props}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-secondary-text space-y-2 ml-4 my-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-secondary-text space-y-2 ml-4 my-4">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-secondary-text py-1">{children}</li>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 border border-border rounded-lg">
              <table className="w-full text-sm text-left text-secondary-text">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="text-xs uppercase bg-muted text-secondary-text">{children}</thead>
          ),
          tr: ({ children }) => (
            <tr className="border-b bg-surface border-border hover:bg-surface-hover transition-colors">{children}</tr>
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
