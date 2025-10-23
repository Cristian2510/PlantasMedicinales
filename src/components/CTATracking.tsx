'use client';

import { useAnalytics } from '@/hooks/useAnalytics';

interface CTATrackingProps {
  children: React.ReactNode;
  elementId: string;
  elementText: string;
  location: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const CTATracking: React.FC<CTATrackingProps> = ({
  children,
  elementId,
  elementText,
  location,
  href,
  onClick,
  className
}) => {
  const { trackClick } = useAnalytics();

  const handleClick = () => {
    // Track el click
    trackClick(elementId, elementText, location);
    
    // Ejecutar onClick personalizado si existe
    if (onClick) {
      onClick();
    }
  };

  if (href) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
};
