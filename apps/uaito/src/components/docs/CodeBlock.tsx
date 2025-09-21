'use client';

import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg overflow-hidden mb-4 group">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-850 text-gray-400 py-2 px-4 border-b border-gray-700 flex justify-between items-center">
        <span className="text-xs font-medium">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-xs rounded-md 
            bg-gray-700/50 hover:bg-gray-700 transition-colors duration-200
            text-gray-300 hover:text-white"
          aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
        >
          {copied ? (
            <>
              <CheckIcon className="w-3 h-3" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950">
        <Highlight
          theme={themes.nightOwl}
          code={code.trim()}
          language={language.toLowerCase()}
        >
          {({ className, tokens, getLineProps, getTokenProps }) => (
            <div className="flex">
              <div className="text-gray-500 text-xs py-4 px-4 text-right select-none 
                border-r border-gray-700/50 bg-gray-800/30 min-w-[3.5rem]">
                {tokens.map((_, i) => (
                  <div key={i + 1}>{i + 1}</div>
                ))}
              </div>
              <pre className="p-4 overflow-x-auto flex-1 text-sm">
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            </div>
          )}
        </Highlight>
      </div>
    </div>
  );
}

// Add these icon components or import from your preferred icon library
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);