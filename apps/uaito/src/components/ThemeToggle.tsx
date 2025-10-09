import { useEffect } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { setTheme } from '@/redux/userSlice';
import { useAppSelector } from '@/redux/store';

export const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useAppSelector((state) => state.user.theme);

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      // Use system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (systemTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else {
      // Use user preference
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      if (e.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    dispatch(setTheme(newTheme));
  };

  return (
    <div className="flex items-center gap-2 p-1 bg-surface border border-border rounded-lg">
      <button
        type="button"
        onClick={() => handleThemeChange('light')}
        className={`p-2 rounded-md transition-all duration-200 ${
          theme === 'light'
            ? 'bg-primary text-white'
            : 'text-secondary-text hover:text-primary-text hover:bg-surface-hover'
        }`}
        title="Light mode"
      >
        <SunIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => handleThemeChange('dark')}
        className={`p-2 rounded-md transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-primary text-white'
            : 'text-secondary-text hover:text-primary-text hover:bg-surface-hover'
        }`}
        title="Dark mode"
      >
        <MoonIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => handleThemeChange('system')}
        className={`p-2 rounded-md transition-all duration-200 ${
          theme === 'system'
            ? 'bg-primary text-white'
            : 'text-secondary-text hover:text-primary-text hover:bg-surface-hover'
        }`}
        title="System preference"
      >
        <ComputerDesktopIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

