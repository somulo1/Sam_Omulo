import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Project } from '../../../types/portfolio';
import ImageUploadForm from './ImageUploadForm';
import ProjectImageGallery from '../ProjectImageGallery';
import { createProjectImage } from '../../../lib/projectImages';
import { supabase } from '../../../lib/supabaseClient';
import { createSlug } from '../../../utils/slug';

// Type for detailed error handling
type ImageUploadError = {
  message: string;
  code?: string;
};

// Updated schema to match Project type
const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  technologies: z.array(z.string().min(1, 'Technology cannot be empty')).min(1, 'At least one technology is required'),
  imageUrl: z.string().url('Invalid image URL').default(''),
  github_url: z.string().url('Invalid GitHub URL'),
  liveUrl: z.string().url('Invalid live URL').optional(),
});

interface ProjectFormProps {
  project?: Partial<Project>;
  onSubmit: (data: Project) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel }) => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(project?.imageUrl || null);
  const [imageUploadError, setImageUploadError] = useState<ImageUploadError | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingImageUpload, setPendingImageUpload] = useState<{
    publicUrl: string;
    path: string;
  } | null>(null);

  const projectId = project?.id;

  const handleImageUpload = async (publicUrl: string, path: string) => {
    try {
      setIsSubmitting(true);
      
      // Always store pending image upload, whether editing or creating
      setPendingImageUpload({ publicUrl, path });
      setUploadedImageUrl(publicUrl);
      setImageUploadError(null);
    } catch (error) {
      console.error('Error handling image upload:', error);
      setImageUploadError({
        message: error instanceof Error ? error.message : 'Failed to process image upload'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageError = (error: string) => {
    setImageUploadError({ message: error });
  };

  const handleImageSelect = async (imageUrl: string) => {
    try {
      setUploadedImageUrl(imageUrl);
      setCurrentImage(imageUrl);
      setImageUploadError(null);
    } catch (error) {
      console.error('Error selecting image:', error);
      setImageUploadError({
        message: error instanceof Error ? error.message : 'Failed to select image'
      });
    }
  };

  return (
    <div>
      <ImageUploadForm
        projectId={projectId}
        onUpload={handleImageUpload}
        onError={handleImageError}
        currentImage={currentImage}
        isLoading={isSubmitting}
      />
      
      {project?.id && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Images</h3>
          <ProjectImageGallery
            projectId={project.id}
            onSelect={handleImageSelect}
            selectedImageId={uploadedImageUrl || undefined}
            onDelete={async (image) => {
              if (uploadedImageUrl === image.image_url) {
                setUploadedImageUrl(null);
                setCurrentImage(null);
              }
            }}
          />
        </div>
      )}
      
      {imageUploadError && (
        <p className="text-red-500 text-sm mt-2">{imageUploadError.message}</p>
      )}
    </div>
  );
};

export default ProjectForm;