import React, { useState } from 'react';
import { useForm, useFieldArray, FieldArrayPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Project } from '../../../types/portfolio';
import ImageUploader from '../ImageUpload';

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
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(project?.imageUrl || '');
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const { 
    register, 
    control,
    handleSubmit, 
    setValue, 
    formState: { errors, isSubmitting } 
  } = useForm<Project>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: project?.id || uuidv4(),
      title: project?.title || '',
      description: project?.description || '',
      technologies: project?.technologies?.length ? project.technologies : [''],
      imageUrl: project?.imageUrl || '',
      githubUrl: project?.githubUrl || '',
      liveUrl: project?.liveUrl || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'technologies' as FieldArrayPath<Project>,
  });

  const handleImageUpload = (url: string | null) => {
    const newImageUrl = url || '';
    setUploadedImageUrl(newImageUrl);
    setValue('imageUrl', newImageUrl);
    setImageUploadError(null);
  };

  const handleImageUploadError = (error: string | ImageUploadError) => {
    // Normalize error to a string
    const errorMessage = typeof error === 'string' 
      ? error 
      : error.message || 'An unknown error occurred during image upload';
    
    setImageUploadError(errorMessage);
  };

  const handleSubmitForm = async (data: Project) => {
    const projectData: Project = {
      ...data,
      id: data.id || uuidv4(), // Ensure ID is always present
      imageUrl: uploadedImageUrl,
    };
    onSubmit(projectData);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6 p-6 bg-white rounded-xl shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            {...register('title')}
            placeholder="Enter project title"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
          <input
            type="text"
            {...register('githubUrl')}
            placeholder="https://github.com/username/project"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.githubUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.githubUrl.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          {...register('description')}
          placeholder="Describe your project"
          rows={4}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <input
                type="text"
                {...register(`technologies.${index}` as const)}
                placeholder={`Technology ${index + 1}`}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => append('')}
            className="text-blue-500 hover:text-blue-700 mt-2"
          >
            + Add Technology
          </button>
          {errors.technologies && (
            <p className="mt-1 text-sm text-red-600">{errors.technologies.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Image URL (Optional)</label>
          <input
            type="text"
            {...register('imageUrl')}
            placeholder="https://example.com/project-image.jpg"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Or Upload Project Image</label>
          <ImageUploader
            name="projectImageUpload"
            onChange={handleImageUpload}
            onError={handleImageUploadError}
            defaultImage={uploadedImageUrl}
          />
          {imageUploadError && (
            <p className="mt-1 text-sm text-red-600">{imageUploadError}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Live URL (Optional)</label>
        <input
          type="text"
          {...register('liveUrl')}
          placeholder="https://example.com"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.liveUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.liveUrl.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;