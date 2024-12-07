import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the project root
dotenv.config({ path: resolve(__dirname, '..', '.env') });

async function configureStorage() {
  console.log(' Configuring Supabase Storage');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error(' Missing Supabase configuration');
    console.log('Required environment variables:');
    console.log('- VITE_SUPABASE_URL:', supabaseUrl ? ' ' : ' ');
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? ' ' : ' ');
    process.exit(1);
  }

  console.log(' Using Supabase URL:', supabaseUrl);

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  const bucketConfigs = [
    {
      name: 'portfolio-images',
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      fileSizeLimit: 5242880, // 5MB
    },
    {
      name: 'profile-photos',
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 2097152, // 2MB
    }
  ];

  for (const config of bucketConfigs) {
    console.log(`\n Configuring bucket: ${config.name}`);
    
    try {
      // First, try to get the bucket to see if it exists
      const { data: existingBucket, error: getBucketError } = await supabase
        .storage
        .getBucket(config.name);

      if (getBucketError && getBucketError.message !== 'Bucket not found') {
        console.error(` Error checking bucket ${config.name}:`, getBucketError);
        continue;
      }

      if (!existingBucket) {
        // Create bucket if it doesn't exist
        console.log(`Creating new bucket: ${config.name}`);
        const { error: createError } = await supabase
          .storage
          .createBucket(config.name, {
            public: config.public,
            allowedMimeTypes: config.allowedMimeTypes,
            fileSizeLimit: config.fileSizeLimit
          });

        if (createError) {
          console.error(` Failed to create bucket ${config.name}:`, createError);
          continue;
        }
      }

      // Update bucket configuration
      console.log(`Updating bucket configuration: ${config.name}`);
      const { error: updateError } = await supabase
        .storage
        .updateBucket(config.name, {
          public: config.public,
          allowedMimeTypes: config.allowedMimeTypes,
          fileSizeLimit: config.fileSizeLimit
        });

      if (updateError) {
        console.error(` Failed to update bucket ${config.name}:`, updateError);
        continue;
      }

      console.log(` Successfully configured bucket: ${config.name}`);
    } catch (error) {
      console.error(` Unexpected error configuring bucket ${config.name}:`, error);
    }
  }

  console.log('\n Storage configuration completed');
}

configureStorage().catch(error => {
  console.error(' Fatal error:', error);
  process.exit(1);
});
