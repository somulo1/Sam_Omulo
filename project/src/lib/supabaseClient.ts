import { createClient } from '@supabase/supabase-js';

console.log('Environment variables:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
  MFA_ENABLED: import.meta.env.MFA_ENABLED,
  IP_WHITELIST: import.meta.env.IP_WHITELIST,
});

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);
console.log('Service Role Key:', serviceRoleKey);

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

// Optional: Implement MFA and IP whitelisting if applicable
export const isMFAEnabled = import.meta.env.MFA_ENABLED === 'true';
export const ipWhitelist = JSON.parse(import.meta.env.IP_WHITELIST || '[]');

console.log('MFA Enabled:', isMFAEnabled);
console.log('IP Whitelist:', ipWhitelist);

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
