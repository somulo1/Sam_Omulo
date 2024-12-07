import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../../lib/supabaseClient';
import { BUCKET_NAMES, getStorageUrl } from '../../../config/storage';

interface ImageUploadFormProps {
  projectId: string;
  onUpload: (publicUrl: string, path: string) => void;
  onError: (error: string) => void;
  currentImage?: string | null;
  isLoading?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  projectId,
  onUpload,
  onError,
  currentImage,
  isLoading = false,
}) => {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      
      if (!file) {
        onError('No file selected');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        onError('File size must be less than 5MB');
        return;
      }

      setUploading(true);

      // Generate a unique filename with timestamp to prevent collisions
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${uuidv4()}_${timestamp}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAMES.PORTFOLIO_IMAGES)
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const publicUrl = getStorageUrl(
        'PORTFOLIO_IMAGES',
        fileName
      );

      onUpload(publicUrl, fileName);
    } catch (error) {
      console.error('Error uploading image:', error);
      onError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }, [projectId, onUpload, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: isLoading || uploading,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
          ${isLoading || uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-gray-600">Uploading...</p>
        ) : (
          <div>
            <p className="text-gray-600">
              {isDragActive
                ? 'Drop the image here...'
                : 'Drag and drop an image here, or click to select'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              PNG, JPG, or WEBP (max 5MB)
            </p>
          </div>
        )}
      </div>

      {currentImage && (
        <div className="mt-4">
          <img
            src={currentImage}
            alt="Current project"
            className="max-w-xs rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadForm;
