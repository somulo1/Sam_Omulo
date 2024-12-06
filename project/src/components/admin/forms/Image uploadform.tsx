import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ImageUploadFormProps {
  onSubmit: (image: File | null) => void;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Check if the file is an image
    const fileType = file.type.split('/')[0];

    if (fileType !== 'image') {
      setError('Only image files are allowed.');
      setImageFile(null);
      setImagePreview(undefined);
      return;
    }

    // Check if the file size is less than 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      setImageFile(null);
      setImagePreview(undefined);
      return;
    }

    setError(undefined);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmitForm = () => {
    onSubmit(imageFile);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
        <div className="relative">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full border"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-full border border-gray-300">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            {...register('image')}
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => {
            setImageFile(null);
            setImagePreview(undefined);
            setError(undefined);
          }}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={!imageFile}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          Upload
        </button>
      </div>
    </form>
  );
};

export default ImageUploadForm;
