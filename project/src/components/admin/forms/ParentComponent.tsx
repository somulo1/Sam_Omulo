import React, { useState } from 'react';
import ImageUploadForm from './ImageUploadForm';  // Adjust the import path

interface ParentComponentProps {
  projectId: string;  // Define projectId as a prop
}

const ParentComponent: React.FC<ParentComponentProps> = ({ projectId }) => {
  // State to store the uploaded image URL
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUpload = (publicUrl: string, path: string) => {
    console.log('Image uploaded successfully:', publicUrl, path);
    setCurrentImage(publicUrl); // Update the current image state
    setIsLoading(false); // Reset loading state
  };

  console.log('ParentComponent rendered');
  console.log('Project ID:', projectId);
  console.log('Current Image:', currentImage);
  console.log('Is Loading:', isLoading);

  const handleError = (error: string) => {
    console.error('Error uploading image:', error);
    setIsLoading(false);  // Reset loading state in case of error
  };

  return (
    <div>
      <ImageUploadForm
        projectId={projectId}  // Ensure projectId is defined and passed
        onUpload={handleUpload}
        onError={handleError}
        currentImage={currentImage}
        isLoading={isLoading}
      />

      {currentImage && (
        <div className="mt-4">
          <img
            src={currentImage}
            alt="Uploaded"
            className="max-w-xs rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default ParentComponent;
