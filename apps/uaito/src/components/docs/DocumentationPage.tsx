import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { RIDBProps } from '@/types';
import SectionRenderer from './SectionRenderer';
import { Header } from '../Header';
import { FadeInSection } from '../ClientSideComponents';

export interface DocumentationPageConfig {
  // Custom content to display before sections
  customContent?: ReactNode;
  // Custom sidebar content to display in the sidebar
  customSidebar?: ReactNode;
  // Override for back button href
  backButtonHref?: string;
  // Whether to show the menu
  showMenu?: boolean;
  // Custom class names
  className?: string;
  showSections?: boolean;
}

export interface DocumentationPageProps extends RIDBProps, DocumentationPageConfig {}

// Recursive MenuItem component
const MenuItem = ({ 
  item, 
  href, 
  isBackButton = false,
  activeSection = '',
  onBackClick
}: { 
  item: any;
  href?: string;
  isBackButton?: boolean;
  activeSection?: string;
  onBackClick?: () => void;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (isBackButton && onBackClick) {
      e.preventDefault();
      onBackClick();
    }
  };

  return (
    <div >
      <a
        href={href ?? `#${item.title.toLowerCase().replace(/\s+/g, '-')}`}
        onClick={handleClick}
        className={`group flex items-center text-sm font-medium transition-all duration-200 ${
          isBackButton
            ? 'text-accent hover:text-accent-hover flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20 hover:border-accent/30 hover:shadow-lg'
            : activeSection === item.title.toLowerCase().replace(/\s+/g, '-')
            ? 'text-accent bg-accent/10 p-3 rounded-lg border border-accent/20 shadow-lg'
            : 'text-secondary-text hover:text-primary-text p-3 rounded-lg hover:bg-surface-hover border border-transparent hover:border-border'
        }`}
      >
        {isBackButton && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
            <title>Back Icon</title>
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        )}
        {item.title}
      </a>
      {item.subMenus && item.subMenus.length > 0 && (
        <div className="mt-2 ml-4 space-y-1">
          {item.subMenus.map((subItem: any) => (
            <MenuItem 
              key={`item-${subItem.title}`} 
              item={subItem} 
              activeSection={activeSection}
              onBackClick={onBackClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DocumentationPage: React.FC<DocumentationPageProps> = ({
  sections = [],
  structuredMenu = [],
  customContent,
  customSidebar,
  backButtonHref,
  showMenu = true,
  className = '',
  showSections = true
}) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const router = useRouter();

  // Force dark mode on docs pages for consistency
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    
    return () => {
      // Cleanup - theme will be restored by other pages
    };
  }, []);

  useEffect(() => {
    const observerOptions = {
      rootMargin: '-20% 0px -60% 0px',
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all section elements
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className={`min-h-screen bg-background text-gray-100 ${className}`}>
      <Header />
      {/* Main container */}
      <div className="relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex min-h-screen pt-20">
            {/* Sidebar */}
            <aside className="fixed w-72 hidden md:block h-[calc(100vh-5rem)] overflow-y-auto">
              <nav className="p-6 space-y-4" role="navigation" aria-label="Main navigation">
                {backButtonHref !== undefined && (
                  <MenuItem 
                    item={{ title: "Go Back" }} 
                    href={backButtonHref} 
                    isBackButton={true}
                    onBackClick={handleBackClick}
                  />
                )}
                {customSidebar && (
                  <div className="mb-6">
                    {customSidebar}
                  </div>
                )}
                {showMenu && !customSidebar && structuredMenu.map((item, idx) => (
                  <MenuItem 
                    key={idx} 
                    item={item} 
                    activeSection={activeSection}
                    onBackClick={handleBackClick}
                  />
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <main className="w-full md:flex-1 md:ml-72 px-4 md:px-8 py-8">
              <div className="max-w-4xl mx-auto">
                {/* Custom content section */}
                {customContent && (
                  <div className="mb-12">
                    {customContent}
                  </div>
                )}
                
                {/* Sections */}
                <FadeInSection>
                  { sections.map((section, index) => (
                    <SectionRenderer key={`section-${index}`} section={section} />
                  ))}
                </FadeInSection>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
