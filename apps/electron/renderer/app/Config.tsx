import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

import { Header } from './components/Header';
import { useMountedApp } from './redux/store';
import { toggleConfig } from './redux/userSlice';
import { Markdown } from './components/Markdown';
import ExternalLink from './components/ELink';
import { LLMProvider } from '@uaito/sdk';

const SelectInput: React.FC<{
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  label: string;
}> = ({ id, value, onChange, options, placeholder, label }) => {
  return (
    <div className="relative my-5">
      <label htmlFor={id} className="text-left block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className="block w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
          aria-label={label}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  label: string;
}> = ({ id, value, onChange, type = "text", placeholder, label }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative my-5">
      <label htmlFor={id} className="text-left block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="block w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 pr-10"
          aria-label={label}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const Anthropic: React.FC = () => {
  const app = useMountedApp();

  const [apiKey, setApiKey] = useState(app.user.apiKey);

  const handleSave = () => {

    app.dispatch(toggleConfig({
      llm: LLMProvider.Anthropic,
      baseUrl: '',
      apiKey
    }));
    toast.info("Your configuration was updated", {position: 'top-right'});
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">API</h3>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          This configuration is required for you to connect to your subscription account.
        </p>
        <InputField
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          type="password"
          label="API Key"
          placeholder="Enter your API key"
        />
<p className="mb-4 text-gray-700 dark:text-gray-300">
          You can get your authentication token if you  <ExternalLink
          href="https://uaito.io/dashboard" 
        >
          Login
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </ExternalLink> into your account,     
        </p>
        
        <button
          onClick={handleSave}
          className="mb-4 px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200"
        >
          Save Configuration
        </button>
        <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
          <li>Advanced natural language processing</li>
          <li>Contextual understanding</li>
          <li>Multilingual support</li>
          <li>Customizable outputs</li>
        </ul>
        <a 
          href="https://uaito.io/docs" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          Learn more about UAITO
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    </div>
  );
};

  

const Config: React.FC = () => {
  const app = useMountedApp();
  const original = app.user.llmProvider || LLMProvider.Anthropic;
  const [currentProvider, setCurrentProvider] = useState<LLMProvider>(original);
  const enableSwitch = false;
  const onConfigToggle = () => {
    const next = currentProvider === LLMProvider.Anthropic ? LLMProvider.Ollama : LLMProvider.Anthropic;
    setCurrentProvider(next);
  };

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
      <Header enableChats={false} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Your config</h2>
          {
            enableSwitch && <button
            onClick={onConfigToggle}
            className="my-6 px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200"
          >
            {currentProvider === LLMProvider.Anthropic ? 'Switch to Ollama' : 'Switch to Anthropic'}
          </button>
          }
          {currentProvider === LLMProvider.Anthropic ? <Anthropic /> : <p>Not supported</p>}
        </div>
       
      </main>
    </div>
  );
};

export default Config;