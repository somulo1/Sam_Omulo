import React, { useEffect, useState } from 'react';
import { fetchProjectImages } from '../../lib/imageUpload';
import { ProjectImage } from '../../lib/projectImages';

interface ImageGalleryProps {
  projectId: string;
  onImageSelect?: (imageUrl: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ projectId, onImageSelect }) => {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const projectImages = await fetchProjectImages(projectId);
        setImages(projectImages);
      } catch (err) {
        setError('Failed to load project images');
        console.error('Error loading images:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadImages();
    }
  }, [projectId]);

  if (loading) {
    return <div className="flex justify-center items-center p-4">Loading images...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (images.length === 0) {
    return <div className="text-gray-500 p-4">No images uploaded yet</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative group cursor-pointer overflow-hidden rounded-lg"
          onClick={() => onImageSelect?.(image.image_url)}
        >
          <img
            src={image.image_url}
            alt="Project"
            className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200" />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
