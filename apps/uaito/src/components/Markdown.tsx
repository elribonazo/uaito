'use client'
import React, { useState } from 'react';
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// @ts-ignore
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/hooks/useTheme';

const CopyButton = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-secondary-text bg-surface rounded-md hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

export const CodeBlock = ({ searchText, node, inline, className, children, ...props }) => {
  const { isDark } = useTheme();
  const match = /language-(\w+)/.exec(className || '');
  const highlightedCode = String(children).replace(/\n$/, '');

  const renderComponent = (component, i) => {
    const props = component?.properties ?? {};
    const TagName = component?.tagName ?? undefined;
    const children = component?.children ?? [];
    const value = component?.value ?? '';
    if (component.type === "text") {
      const processed = processMessage(value, searchText);
      const regex = new RegExp('<mark style="background-color: yellow;">(.*?)</mark>', 'gmi');
      const parts = processed.split(regex);
      return (
        <span key={`span-${i}`} {...props}>
          {parts.map((part, index) => 
            index % 2 === 0 ? part : <mark key={`mark-${index}`} className="bg-warning/30 dark:bg-warning/20">{part}</mark>
          )}
        </span>
      );
    } else if (component.type === "element") {
      return <TagName key={`tag-${TagName}-${i}`} className={`${props.className?.join(" ") || ''}`} {...props}>
{children.map(renderComponent)}
        </TagName>
    }
  }

  const customRenderer = ({ rows }) => {
    return rows.map((row, index) => (
      <div key={index} className="flex">
        <span className="w-10 pr-4 text-right text-tertiary-text select-none opacity-50">
          {index + 1}
        </span>
        <span className="flex-1">{renderComponent(row, index)}</span>
      </div>
    ));
  };

  const showSyntax = !inline && match !== null && match[1];
  return showSyntax ? (
    <div className="relative mt-4 mb-6">
      <CopyButton code={highlightedCode} />
      {/* @ts-ignore */}
      <SyntaxHighlighter
        language={match[1]}
        PreTag="div"
        renderer={customRenderer}
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          padding: '1rem',
          borderRadius: '0.375rem',
          backgroundColor: isDark ? undefined : 'rgb(255, 255, 255)',
        }}
        codeTagProps={{
          className: 'text-sm font-mono',
        }}
        {...props}
      >
        {highlightedCode}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={`${className} px-1 py-0.5 rounded bg-muted text-primary-text`} {...props}>
      {highlightedCode}
    </code>
  );
};

const processMessage = (message, search) => {
  if (!search.length) return message;
  const regex = new RegExp(search, 'gmi');
  return message.replace(regex, (match) => `<mark style="background-color: yellow;">${match}</mark>`);
}

export function Markdown({ children, searchText }) {
  return (
    <ReactMarkdown
      components={{
        code: (props: any) => <CodeBlock searchText={searchText} {...props} />
      }}
    >
      {children}
    </ReactMarkdown>
  );
}