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
  onSubmit: (imageUrl: string) => void;
  onChange: (url: string) => void;
  defaultImage?: string;
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
  onSubmit,
  onChange,
  defaultImage,
}) => {
  console.log('ImageUploadForm rendered');
  console.log('Project ID:', projectId);
  console.log('Current Image:', currentImage);
  console.log('Is Loading:', isLoading);
  console.log('onUpload prop:', onUpload);

  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log('onDrop called');
    try {
      const file = acceptedFiles[0];
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${uuidv4()}_${timestamp}.${fileExt}`;

      console.log('Uploading file:', fileName);

      setUploading(true);

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAMES.PORTFOLIO_IMAGES)
        .upload(fileName, file);

      setUploading(false);

      if (uploadError) {
        console.log('Error uploading file:', uploadError);
        throw uploadError;
      }

      const publicUrl = `${getStorageUrl(BUCKET_NAMES.PORTFOLIO_IMAGES, fileName)}/${BUCKET_NAMES.PORTFOLIO_IMAGES}`;
      console.log('File uploaded successfully:', publicUrl);

      onUpload(publicUrl, fileName);
    } catch (error) {
      console.error('Error uploading image:', error);
      onError(error instanceof Error ? error.message : 'Failed to upload image');
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: isLoading || uploading,
  });

  return (
    <div className="space-y-4">
      {isLoading && <p>Loading...</p>}
      {currentImage && <img src={currentImage} alt="Uploaded" />}
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
    </div>
  );
};

ImageUploadForm.defaultProps = {
  currentImage: null,
  isLoading: false,
  onUpload: () => console.warn('No upload function provided'), // Default function
  onSubmit: () => console.warn('No submit function provided'), // Default function
  onChange: () => console.warn('No change function provided'), // Default function
  defaultImage: '', // Default value
};

export default ImageUploadForm;
