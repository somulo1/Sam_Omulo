import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

// Allowed buckets
const ALLOWED_BUCKETS = ['portfolio-images', 'profile-photos'];

// Bucket-specific configurations
const BUCKET_CONFIGS = {
  'portfolio-images': {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  },
  'profile-photos': {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  }
};

interface UploadResult {
  publicUrl: string;
  path: string;
  error?: string;
}

// Validate file type and size
const validateFile = (file: File, bucketName: string = 'portfolio-images'): boolean => {
  const config = BUCKET_CONFIGS[bucketName as keyof typeof BUCKET_CONFIGS];
  
  if (!config) {
    console.error('Invalid bucket name');
    return false;
  }

  if (!config.allowedTypes.includes(file.type)) {
    console.error(`Invalid file type for ${bucketName}. Allowed types:`, config.allowedTypes);
    return false;
  }

  if (file.size > config.maxSize) {
    console.error(`File too large for ${bucketName}. Max size is ${config.maxSize / 1024 / 1024}MB`);
    return false;
  }

  return true;
};

const getStoragePath = (bucket: string, fileName: string) => `${bucket}/${fileName}`;

// Upload image to storage and create database record
export const uploadImage = async (
  file: File,
  projectId: string,
  bucket: string = 'portfolio-images'
): Promise<UploadResult> => {
  try {
    if (!validateFile(file, bucket)) {
      return {
        publicUrl: '',
        path: '',
        error: 'Invalid file type or size'
      };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}_${Date.now()}.${fileExt}`;
    const filePath = `${bucket}/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return {
        publicUrl: '',
        path: '',
        error: uploadError.message
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    // Create database record
    const { data: imageData, error: dbError } = await supabase
      .from('project_images')
      .insert({
        project_id: projectId,
        image_url: publicUrl,
        storage_path: filePath
      })
      .select('id, project_id, image_url, storage_path, created_at, updated_at')
      .single();

    if (dbError) {
      console.error('Error creating database record:', dbError);
      // Clean up storage if database insert fails
      await supabase.storage.from(bucket).remove([filePath]);
      return {
        publicUrl: '',
        path: '',
        error: dbError.message
      };
    }

    return {
      publicUrl,
      path: filePath,
      error: undefined
    };
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return {
      publicUrl: '',
      path: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const deleteImage = async (bucket: string, path: string): Promise<void> => {
  try {
    // Validate bucket
    if (!ALLOWED_BUCKETS.includes(bucket)) {
      throw new Error(`Invalid bucket. Allowed buckets: ${ALLOWED_BUCKETS.join(', ')}`);
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

export const getImageUrl = (bucket: string, path: string): string => {
  // Validate bucket
  if (!ALLOWED_BUCKETS.includes(bucket)) {
    throw new Error(`Invalid bucket. Allowed buckets: ${ALLOWED_BUCKETS.join(', ')}`);
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data?.publicUrl || '';
};

// Fetch project images
export const fetchProjectImages = async (projectId: string) => {
  try {
    console.log('Fetching images for project ID:', projectId);
    const { data, error } = await supabase
      .from('project_images')
      .select('id, project_id, image_url, storage_path, created_at, updated_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching project images:', error);
      throw error;
    }

    if (!data) return [];

    // Map the data and add the public URL for each image
    return data.map(image => ({
      ...image,
      url: image.image_url || getImageUrl('portfolio-images', image.storage_path)
    }));
  } catch (error) {
    console.error('Error in fetchProjectImages:', error);
    return [];
  }
};

// Fetch skill images
export const fetchSkillImages = async (skillId: string) => {
  const { data, error } = await supabase
    .from('skill_images')
    .select('*')
    .eq('skill_id', skillId);

  if (error) {
    console.error('Error fetching skill images:', error);
    return [];
  }

  return data;
};

// Display project images
export const displayProjectImages = async (projectId: string) => {
  const images = await fetchProjectImages(projectId);
  const container = document.getElementById('project-images-container');
  if (container) {
    container.innerHTML = ''; // Clear existing images
    images.forEach(image => {
      const imgElement = document.createElement('img');
      imgElement.src = image.url; // Use the URL to display the image
      container.appendChild(imgElement);
    });
  }
};

// Display skill images
export const displaySkillImages = async (skillId: string) => {
  const images = await fetchSkillImages(skillId);
  const container = document.getElementById('skill-images-container');
  if (container) {
    container.innerHTML = ''; // Clear existing images
    images.forEach(image => {
      const imgElement = document.createElement('img');
      imgElement.src = getImageUrl('portfolio-images', image.storage_path); // Use the URL to display the image
      container.appendChild(imgElement);
    });
  }
};
