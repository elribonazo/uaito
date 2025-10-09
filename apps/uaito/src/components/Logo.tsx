import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  variant?: 'default' | 'small' | 'large';
}

/**
 * Theme-aware Logo component
 * 
 * Automatically adds a subtle background in light mode to improve readability
 * while keeping the original logo colors intact.
 */
export const Logo: React.FC<LogoProps> = ({ 
  width = 25, 
  height = 25, 
  className = '', 
  priority = false,
  variant = 'default'
}) => {
  // Determine if we need a background based on size
  const needsBackground = width >= 25;
  
  // Different styling variants
  const variantStyles = {
    default: needsBackground 
      ? 'p-1.5 bg-gradient-to-br from-surface to-muted dark:from-transparent dark:to-transparent border border-border dark:border-transparent rounded-lg shadow-sm dark:shadow-none'
      : '',
    small: needsBackground
      ? 'p-1 bg-surface dark:bg-transparent border border-border/50 dark:border-transparent rounded-md'
      : '',
    large: 'p-3 bg-gradient-to-br from-surface via-surface-hover to-muted dark:from-transparent dark:via-transparent dark:to-transparent border-2 border-border dark:border-transparent rounded-xl shadow-md dark:shadow-none'
  };

  return (
    <div className={`inline-flex items-center justify-center transition-all ${variantStyles[variant]} ${className}`}>
      <Image
        src="/UAITO.png"
        alt="UAITO Logo"
        width={width}
        height={height}
        className="animate-subtle-bounce"
        priority={priority}
      />
    </div>
  );
};

