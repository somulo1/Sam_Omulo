import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // This needs to be added to your .env file

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    // Create the bucket if it doesn't exist
    const { data: bucket, error: bucketError } = await supabase
      .storage
      .createBucket('portfolio-images', {
        public: true, // Make the bucket public
        fileSizeLimit: 5242880, // 5MB in bytes
        allowedMimeTypes: ['image/*']
      });

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('Bucket already exists, updating configuration...');
      } else {
        throw bucketError;
      }
    } else {
      console.log('Created bucket:', bucket);
    }

    // Update bucket configuration
    const { error: updateError } = await supabase
      .storage
      .updateBucket('portfolio-images', {
        public: true,
        fileSizeLimit: 5242880,
        allowedMimeTypes: ['image/*']
      });

    if (updateError) {
      throw updateError;
    }

    // Set CORS configuration
    const corsConfiguration = {
      "corsAllowedOrigins": ["*"], // In production, replace with your specific domains
      "corsAllowedMethods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      "corsAllowedHeaders": ["*"],
      "corsMaxAge": 600 // 10 minutes
    };

    console.log('Storage bucket configured successfully!');
    console.log('Next steps:');
    console.log('1. Add your Supabase project URL and anon key to .env');
    console.log('2. Update CORS configuration in your Supabase dashboard if needed');
    console.log('3. Make sure your storage policies are set correctly');

  } catch (error) {
    console.error('Error setting up storage:', error);
    process.exit(1);
  }
}

setupStorage();
