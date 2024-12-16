import React, { useState } from 'react';
import { useForm, useFieldArray, FieldArrayPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Skill } from '../../../types/portfolio';

// Enhanced validation schema
const skillSchema = z.object({
  id: z.string().optional(),
  category: z.string()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must be less than 50 characters'),
  icon: z.string().optional(),
  description: z.string().optional(),
  level: z.string().optional(),
  items: z.array(z.string().min(1, 'Skill item cannot be empty')).min(1, 'At least one skill item is required'),
});

interface SkillFormProps {
  skill?: Partial<Skill>;
  onSubmit: (data: Skill) => void;
  onCancel: () => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ skill, onSubmit, onCancel }) => {
  const { 
    register, 
    control,
    handleSubmit, 
    setValue, 
    formState: { errors, isSubmitting } 
  } = useForm<Skill>({
    resolver: zodResolver(skillSchema),
    defaultValues: skill || {},
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items' as FieldArrayPath<Skill>,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-xl shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
          <input
            type="text"
            {...register('name')}
            required
            placeholder="Enter skill name"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skill Description</label>
          <textarea
            {...register('description')}
            placeholder="Enter skill description"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
          <input
            type="text"
            {...register('level')}
            required
            placeholder="Enter skill level"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.level && (
            <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <input
            type="text"
            {...register('category')}
            required
            placeholder="Enter skill category"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
        <input
          type="text"
          {...register('icon')}
          required
          placeholder="Enter icon class (e.g., fas fa-globe)"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.icon && (
          <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
        <ul>
          {fields.map((field, index) => (
            <li key={field.id}>
              <input
                type="text"
                {...register(`items.${index}` as const)}
                required
                placeholder={`Skill Item ${index + 1}`}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
          <button
            type="button"
            onClick={() => append({ id: uuidv4() })}
            className="text-blue-500 hover:text-blue-700 mt-2"
          >
            + Add Skill Item
          </button>
          {errors.items && (
            <p className="mt-1 text-sm text-red-600">{errors.items.message}</p>
          )}
        </ul>
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
