
import React, { useState } from 'react';
import { uploadImage, deleteImage } from '../../lib/imageUpload';

interface ImageUploaderProps {
  name: string;
  onChange: (imageUrl: string | null) => void;
  onError: (error: string | { message: string; code?: string }) => void;
  defaultImage?: string;
  bucket?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  name,
  onChange,
  onError,
  defaultImage,
  bucket = 'portfolio-images',
}) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(defaultImage);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const fileType = file.type.split('/')[0];

    if (fileType !== 'image') {
      const errorMsg = 'Only image files are allowed.';
      setError(errorMsg);
      onError({ message: errorMsg, code: 'INVALID_FILE_TYPE' });
      return;
    }

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

      // Delete previous image if exists
      if (defaultImage) {
        await deleteImage(defaultImage, bucket);
      }

      // Upload new image
      const imageUrl = await uploadImage(file, bucket);
      setImagePreview(imageUrl);
      onChange(imageUrl);
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
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageUploader;
