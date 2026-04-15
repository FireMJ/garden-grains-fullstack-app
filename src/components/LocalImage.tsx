'use client';

interface LocalImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

export default function LocalImage({ src, alt, className, width, height, fill }: LocalImageProps) {
  if (fill) {
    return (
      <div className="relative w-full h-full">
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${className || ''}`}
          loading="lazy"
        />
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
    />
  );
}
