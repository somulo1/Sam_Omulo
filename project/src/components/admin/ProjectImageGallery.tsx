import React, { useEffect, useState } from 'react';
import { fetchProjectImages, deleteImage } from '../../lib/imageUpload';

interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  storage_path: string;
  created_at: string;
}

interface ProjectImageGalleryProps {
  projectId: string;
  onSelect?: (image: ProjectImage) => void;
  selectedImageId?: string;
  onDelete?: (image: ProjectImage) => Promise<void>;
}

const ProjectImageGallery: React.FC<ProjectImageGalleryProps> = ({
  projectId,
  onSelect,
  selectedImageId,
  onDelete
}) => {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const projectImages = await fetchProjectImages(projectId);
        setImages(projectImages);
        setError(null);
      } catch (err) {
        setError('Failed to load images');
        console.error('Error loading images:', err);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [projectId]);

  const handleDelete = async (image: ProjectImage) => {
    try {
      setDeletingId(image.id);
      await deleteImage('portfolio-images', image.storage_path);
      if (onDelete) {
        await onDelete(image);
      }
      setImages(images.filter(img => img.id !== image.id));
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        No images uploaded yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className={`relative group rounded-lg overflow-hidden ${
            selectedImageId === image.id ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <img
            src={image.image_url}
            alt="Project"
            className="w-full h-32 object-cover cursor-pointer"
            onClick={() => onSelect?.(image)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200" />
          
          {onDelete && (
            <button
              onClick={() => handleDelete(image)}
              disabled={deletingId === image.id}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50"
            >
              {deletingId === image.id ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectImageGallery;
