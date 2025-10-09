import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize theme from localStorage or system preference
              (function() {
                try {
                  const persistedState = localStorage.getItem('persist:uaito-root');
                  if (persistedState) {
                    const state = JSON.parse(persistedState);
                    const user = state.user ? JSON.parse(state.user) : null;
                    const theme = user?.theme || 'system';
                    
                    if (theme === 'dark') {
                      document.documentElement.classList.add('dark');
                    } else if (theme === 'light') {
                      document.documentElement.classList.remove('dark');
                    } else {
                      // system preference
                      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        document.documentElement.classList.add('dark');
                      }
                    }
                  } else {
                    // Default to system preference
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (e) {
                  // Fallback to system preference
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                }
              })();
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 