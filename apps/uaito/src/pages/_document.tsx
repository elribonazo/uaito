import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head />
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Set dark mode by default
              document.documentElement.classList.add('dark');
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 