import React from 'react';
import { GatsbyImage, getImage, IGatsbyImageData } from 'gatsby-plugin-image';

interface ImageBlockProps {
  image: IGatsbyImageData;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ImageBlock = ({ 
  image, 
  alt, 
  className,
  style 
}: ImageBlockProps) => {
  const gatsbyImage = getImage(image);
  
  if (!gatsbyImage) {
    return null;
  }

  return (
    <div 
      className={className}
      style={{ 
        display: 'block',
        width: '100%',
        ...style 
      }}
    >
      <GatsbyImage
        image={gatsbyImage}
        alt={alt}
      />
    </div>
  );
};
