import React, { useState } from 'react';
import { uploadImage, deleteImage, fetchProjectImages } from '../../lib/imageUpload';

interface ImageUploaderProps {
  projectId: string;
  setImages: (images: any[]) => void;
  name: string;
  onChange: (imageUrl: string | null) => void;
  onError?: (error: string | { message: string; code?: string }) => void;
  defaultImage?: string;
  bucket?: string;
  onSubmit?: (imageUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  projectId,
  setImages,
  name,
  onChange,
  onError = () => {},
  defaultImage = '',
  bucket = 'portfolio-images',
  onSubmit,
}) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(defaultImage);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = 'File size must be less than 5MB.';
      setError(errorMsg);
      onError({ message: errorMsg, code: 'FILE_TOO_LARGE' });
      return;
    }

    try {
      setIsUploading(true);
      setError(undefined);
      onError('');

      // Delete previous image if exists and is not empty
      if (defaultImage && defaultImage !== '' && typeof defaultImage === 'string') {
        try {
          await deleteImage(defaultImage, bucket);
        } catch (deleteErr) {
          console.warn('Failed to delete previous image:', deleteErr);
        }
      }

      // Upload new image
      const imageUrl = await uploadImage(file as File, projectId, bucket);
      setImagePreview(imageUrl);
      onChange(imageUrl);

      // Fetch updated images
      const fetchedImages = await fetchProjectImages(projectId);
      setImages(fetchedImages);

      // Call onSubmit if it exists
      if (onSubmit) {
        onSubmit(imageUrl);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      const errorObj = { 
        message: errorMessage, 
        code: err instanceof Error ? 'UPLOAD_FAILED' : 'UNKNOWN_ERROR' 
      };
      setError(errorMessage);
      onError(errorObj);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    if (file) {
      await uploadImage(file, projectId, bucket);
      const fetchedImages = await fetchProjectImages(projectId);
      setImages(fetchedImages);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Upload Image</label>
      <div className="relative">
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full border"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-full border border-gray-300">
            {isUploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>
        )}
        <input
          type="file"
          name={name}
          accept="*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
};

export default ImageUploader;
