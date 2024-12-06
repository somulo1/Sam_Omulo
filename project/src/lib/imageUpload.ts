import { supabase } from './supabaseClient';

// Allowed buckets
const ALLOWED_BUCKETS = ['portfolio-images', 'profile-photos'];

// Bucket-specific configurations
const BUCKET_CONFIGS = {
  'portfolio-images': {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  'profile-photos': {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  }
};

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

export const uploadImage = async (
  file: File, 
  bucket: string = 'portfolio-images', 
  customFileName?: string
) => {
  // Validate bucket
  if (!ALLOWED_BUCKETS.includes(bucket)) {
    throw new Error(`Invalid bucket. Allowed buckets: ${ALLOWED_BUCKETS.join(', ')}`);
  }

  // Ensure user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Authentication required for image upload');
    throw new Error('Authentication required');
  }

  // Validate file
  if (!validateFile(file, bucket)) {
    throw new Error('Invalid file');
  }

  try {
    // Generate unique filename with the original file extension
    const fileExt = file.name.split('.').pop();
    if (!fileExt) throw new Error('File extension is missing');
    
    const fileName = customFileName || `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `${bucket}/${fileName}`;

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (error) {
      console.error(`Supabase ${bucket} storage upload error:`, error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      publicUrl: urlData.publicUrl,
      path: filePath,
      bucket: bucket
    };

  } catch (error) {
    console.error(`Comprehensive ${bucket} image upload error:`, error);
    throw error;
  }
};

export const deleteImage = async (
  url: string, 
  bucket: string = 'portfolio-images'
) => {
  // Validate bucket
  if (!ALLOWED_BUCKETS.includes(bucket)) {
    throw new Error(`Invalid bucket. Allowed buckets: ${ALLOWED_BUCKETS.join(', ')}`);
  }

  // Ensure user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Authentication required for image deletion');
    throw new Error('Authentication required');
  }

  try {
    const path = url.split('/').pop();
    if (!path) throw new Error('Invalid image URL');

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error(`${bucket} image deletion error:`, error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Comprehensive ${bucket} image deletion error:`, error);
    throw error;
  }
};
