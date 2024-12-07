import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Validate URL
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid Supabase URL: ${supabaseUrl}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    },
  },
  storage: {
    retryCount: 3,
    retryInterval: 1000,
  },
});

// Storage bucket names
export const STORAGE_BUCKETS = {
  PORTFOLIO_IMAGES: 'portfolio-images',
  PROFILE_PHOTOS: 'profile-photos',
} as const;

// Helper function to get storage path
export const getStoragePath = (bucket: string, fileName: string) => {
  return `${bucket}/${fileName}`.replace(/\/+/g, '/');
};

// Helper function to get public URL with cache busting
export const getPublicStorageUrl = (bucket: string, path: string) => {
  const timestamp = new Date().getTime();
  const url = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
    .data.publicUrl;
  
  return `${url}?t=${timestamp}`;
};
