import { useEffect, useState } from 'react';

/**
 * Hook to detect the current active theme (light or dark)
 * regardless of whether user selected 'system', 'light', or 'dark'
 */
export const useTheme = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check if dark class is on html element
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    // Initial check
    checkTheme();

    // Watch for changes to the html element's class
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return { isDark, isLight: !isDark };
};

