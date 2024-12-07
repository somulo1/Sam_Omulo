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
  githubUrl: z.string().url('Invalid GitHub URL'),
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

  const { register, handleSubmit, control, setValue, formState: { errors }, watch } = useForm<Project>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: project?.id || uuidv4(),
      title: project?.title || '',
      description: project?.description || '',
      technologies: project?.technologies || [],
      imageUrl: project?.imageUrl || '',
      githubUrl: project?.githubUrl || '',
      liveUrl: project?.liveUrl || ''
    }
  });

  const projectId = watch('id');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'technologies' as keyof Pick<Project, 'technologies'>
  });

  const handleImageUpload = async (publicUrl: string, path: string) => {
    try {
      setIsSubmitting(true);
      
      // Always store pending image upload, whether editing or creating
      setPendingImageUpload({ publicUrl, path });
      setUploadedImageUrl(publicUrl);
      setValue('imageUrl', publicUrl);
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
      setValue('imageUrl', imageUrl);
      setCurrentImage(imageUrl);
      setImageUploadError(null);
    } catch (error) {
      console.error('Error selecting image:', error);
      setImageUploadError({
        message: error instanceof Error ? error.message : 'Failed to select image'
      });
    }
  };

  const onFormSubmit = async (data: Project) => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create or edit projects');
      }

      const projectData = data;

      // Create the project in Supabase
      const { data: createdProject, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            ...projectData,
            slug: await createSlug(projectData.title),
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (projectError) {
        console.error('Error creating project:', projectError);
        throw projectError;
      }

      // Handle both 200 and 204 responses as success
      const projectId = createdProject?.id || projectData.id;

      // Then create the project image if there's a pending upload
      if (pendingImageUpload) {
        try {
          await createProjectImage({
            project_id: projectId,
            image_url: pendingImageUpload.publicUrl,
            storage_path: pendingImageUpload.path
          });
          setPendingImageUpload(null);
        } catch (imageError) {
          console.error('Error creating project image:', imageError);
          // Continue with form submission even if image upload fails
        }
      }

      // Call the parent's onSubmit with the complete data
      onSubmit({
        ...data,
        id: projectId
      });
    } catch (error) {
      console.error('Error submitting project:', error);
      setImageUploadError({
        message: error instanceof Error ? error.message : 'Failed to submit project'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
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
                  setValue('imageUrl', '');
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

      {/* Form fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Technologies</label>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`technologies.${index}`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append('')}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Add Technology
            </button>
          </div>
          {errors.technologies && (
            <p className="mt-1 text-sm text-red-600">{errors.technologies.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
          <input
            type="url"
            {...register('githubUrl', { required: 'GitHub URL is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.githubUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.githubUrl.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Live URL (Optional)</label>
          <input
            type="url"
            {...register('liveUrl')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.liveUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.liveUrl.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : project?.id ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;