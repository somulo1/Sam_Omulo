import React, { useState, useEffect } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  onLoadError?: (error: Error) => void;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc = '/img/placeholder.png',
  onLoadError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;

    // Clean up the URL by removing any existing query parameters
    const baseUrl = src.split('?')[0];
    
    // Add cache-busting only for Supabase URLs
    if (baseUrl.includes('supabase.co')) {
      setImgSrc(`${baseUrl}?t=${Date.now()}`);
    } else {
      setImgSrc(src);
    }
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      
      // Try loading without cache-busting first
      if (imgSrc?.includes('?')) {
        setImgSrc(imgSrc.split('?')[0]);
        return;
      }
      
      // If that fails, use fallback
      setImgSrc(fallbackSrc);
      onLoadError?.(new Error(`Failed to load image: ${src}`));
    }
  };

  if (!imgSrc) {
    return null;
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

export default Image;
