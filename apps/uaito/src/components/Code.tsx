import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const Code = ({ children, language }) => {
    return (
        <SyntaxHighlighter language={language} style={oneDark} customStyle={{ borderRadius: '0.375rem', margin: '1em 0' }}>
            {children}
        </SyntaxHighlighter>
    );
};
