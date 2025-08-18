import { GatsbyImage, getImage, IGatsbyImageData } from 'gatsby-plugin-image';

interface ImageBlockProps {
  image: IGatsbyImageData;
  alt: string;
  className?: string;
  style?: Record<string, any>; // Generic CSS properties
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
