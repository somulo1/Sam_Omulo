import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Service } from '../../../types/portfolio';

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
  bulletPoints: z.array(z.string()).min(1, 'At least one bullet point is required'),
  level: z.string().optional(),
  category: z.string().optional(),
});

interface ServiceFormProps {
  service?: Service;
  onSubmit: (data: Service) => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, control } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: service || {
      title: '',
      description: '',
      icon: '',
      bulletPoints: [''],
      level: '',
      category: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bulletPoints',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Icon</label>
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
        <label className="block text-sm font-medium text-gray-700">Level</label>
        <input
          type="text"
          {...register('level')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          {...register('category')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
        <ul>
          {fields.map((field, index) => (
            <li key={field.id}>
              <input
                type="text"
                {...register(`bulletPoints.${index}`)}
                placeholder={`Bullet Point ${index + 1}`}
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
        </ul>
        <button
          type="button"
          onClick={() => append({ id: Math.random() })}
          className="text-blue-500 hover:text-blue-700 mt-2"
        >
          + Add Bullet Point
        </button>
      </div>
      <button type="button" onClick={onCancel} className="mt-4 bg-gray-300 text-black px-4 py-2 rounded-md mr-4">
      Cancel
     </button>
     <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
      Submit
     </button>

    </form>
  );
};

export default ServiceForm;