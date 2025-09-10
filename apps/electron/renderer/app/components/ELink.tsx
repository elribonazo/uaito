import React from 'react';

const ExternalLink = ({ href, children }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if ((window as any).electron) {
      (window as any).electron.openExternal(href);
    } else {
      (window as any).open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <a 
      href={href}
      onClick={handleClick}
      className="text-blue-500 hover:text-blue-700 flex items-center"
    >
      {children}
    </a>
  );
};

export default ExternalLink;