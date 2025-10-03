import { type RefObject, useEffect, useState } from 'react'

interface SearchBarProps {
  onChange: (search: string) => void,
  defaultValue: string,
  inputRef: RefObject<HTMLInputElement | null>
}

const SearchBar = (props: SearchBarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="z-20 fixed top-20 right-0 dark:bg-gray-900 transition-colors duration-300">
      <div className="m-2">
        <input
          type="text"
          value={props.defaultValue}
          placeholder="Search..."
          onChange={(e) => props.onChange(e.target.value)}
          ref={props.inputRef}
          className={`
            w-full p-2 rounded-md
            bg-white dark:bg-gray-800
            text-gray-800 dark:text-gray-200
            border border-gray-300 dark:border-gray-600
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-all duration-300 ease-in-out
            ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
          style={{ borderRadius: '4px' }}
        />
      </div>
    </div>
  );
};

export default SearchBar;