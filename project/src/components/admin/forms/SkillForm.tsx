import React, { useState } from 'react';
import { useForm, useFieldArray, FieldArrayPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Skill } from '../../../types/portfolio';
import ImageUploader from '../ImageUpload';

// Type for detailed error handling
type ImageUploadError = {
  message: string;
  code?: string;
};

// Enhanced validation schema
const skillSchema = z.object({
  id: z.string().optional(),
  category: z.string()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must be less than 50 characters'),
  icon: z.string().optional(),
  items: z.array(z.string().min(1, 'Skill item cannot be empty')).min(1, 'At least one skill item is required'),
});

interface SkillFormProps {
  skill?: Partial<Skill>;
  onSubmit: (data: Skill) => void;
  onCancel: () => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ skill, onSubmit, onCancel }) => {
  const [uploadedIconUrl, setUploadedIconUrl] = useState<string>(skill?.icon || '');
  const [iconUploadError, setIconUploadError] = useState<string | null>(null);

  const { 
    register, 
    control,
    handleSubmit, 
    setValue, 
    formState: { errors, isSubmitting } 
  } = useForm<Skill>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      id: skill?.id || uuidv4(),
      category: skill?.category || '',
      icon: skill?.icon || '',
      items: skill?.items?.length ? skill.items : [''],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items' as FieldArrayPath<Skill>,
  });

  const handleIconUpload = (url: string | null) => {
    const newIconUrl = url || '';
    setUploadedIconUrl(newIconUrl);
    setValue('icon', newIconUrl);
    setIconUploadError(null);
  };

  const handleIconUploadError = (error: string | ImageUploadError) => {
    // Normalize error to a string
    const errorMessage = typeof error === 'string' 
      ? error 
      : error.message || 'An unknown error occurred during icon upload';
    
    setIconUploadError(errorMessage);
  };

  const handleSubmitForm = async (data: Skill) => {
    const skillData: Skill = {
      ...data,
      id: data.id || uuidv4(), // Ensure ID is always present
      icon: uploadedIconUrl,
    };
    onSubmit(skillData);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6 p-6 bg-white rounded-xl shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <input
            type="text"
            {...register('category')}
            placeholder="Enter skill category"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Icon URL (Optional)</label>
          <input
            type="text"
            {...register('icon')}
            placeholder="https://example.com/icon.svg"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.icon && (
            <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Or Upload Icon</label>
        <ImageUploader
          name="skillIconUpload"
          onChange={handleIconUpload}
          onError={handleIconUploadError}
          defaultImage={uploadedIconUrl}
        />
        {iconUploadError && (
          <p className="mt-1 text-sm text-red-600">{iconUploadError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Skill Items</label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <input
                type="text"
                {...register(`items.${index}` as const)}
                placeholder={`Skill Item ${index + 1}`}
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
            + Add Skill Item
          </button>
          {errors.items && (
            <p className="mt-1 text-sm text-red-600">{errors.items.message}</p>
          )}
        </div>
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
          {isSubmitting ? 'Saving...' : 'Save Skill'}
        </button>
      </div>
    </form>
  );
};

export default SkillForm;