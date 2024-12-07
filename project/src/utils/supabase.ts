import { supabase } from '../lib/supabaseClient';

// Generic error handler for Supabase operations
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase Error:', error);
  
  // Detailed error mapping
  const errorMap: { [key: string]: string } = {
    'AuthApiError': 'Authentication failed. Please log in again.',
    'AuthRetryableError': 'Network issue. Please try again.',
    'StorageApiError': 'Storage operation failed. Check your permissions.',
    'default': 'An unexpected error occurred'
  };

  return errorMap[error?.name] || error?.message || errorMap.default;
};

// Utility to upload file to Supabase storage
export const uploadFile = async (
  file: File, 
  bucket: string, 
  path?: string
) => {
  // Comprehensive authentication check
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('User retrieval error:', userError);
      throw new Error('Failed to verify user authentication');
    }

    if (!user) {
      throw new Error('User must be authenticated to upload files');
    }

    // Additional user validation
    if (!user.email) {
      throw new Error('User email is required for upload');
    }

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
    }

    const fileName = path || `${Date.now()}_${file.name}`;
    
    // Detailed upload with comprehensive error handling
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        upsert: true, 
        contentType: file.type,
        cacheControl: '3600', // 1-hour cache
        // Metadata including user ID for RLS policy
        metadata: { 
          userId: user.id,
          userEmail: user.email,
          uploadedAt: new Date().toISOString() 
        }
      });

    if (error) {
      console.error(`Storage upload error for ${fileName}:`, error);
      throw error;
    }

    // Return the public URL of the uploaded file
    const publicUrl = getPublicUrl(bucket, fileName);
    return { publicUrl, data };

  } catch (error) {
    console.error('Complete upload error:', error);
    throw handleSupabaseError(error);
  }
};

export const uploadImage = uploadFile;

// Utility to get public URL for a file in storage
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// Generic fetch utility with error handling
export const fetchFromSupabase = async <T>(
  query: Promise<{ data: T | null; error: any }>
): Promise<T> => {
  try {
    const { data, error } = await query;
    if (error) throw error;
    if (!data) throw new Error('No data found');
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
};