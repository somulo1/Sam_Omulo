const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function setupStorageBucket() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Validate critical inputs
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('❌ Missing Supabase configuration');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false
    }
  });

  // Buckets to create
  const bucketsToCreate = [
    {
      name: 'portfolio-images',
      options: {
        public: false,
        allowedMimeTypes: [
          'image/jpeg', 
          'image/png', 
          'image/gif', 
          'image/webp'
        ],
        fileSizeLimit: 10 * 1024 * 1024 // 10MB max file size
      }
    },
    {
      name: 'profile-photos',
      options: {
        public: false,
        allowedMimeTypes: [
          'image/jpeg', 
          'image/png', 
          'image/gif', 
          'image/webp'
        ],
        fileSizeLimit: 5 * 1024 * 1024 // 5MB max file size
      }
    }
  ];

  try {
    for (const bucket of bucketsToCreate) {
      console.log(`🔍 Processing bucket: ${bucket.name}`);

      // Check if bucket already exists
      const { data: existingBucket, error: existError } = await supabase.storage.getBucket(bucket.name);

      if (existError) {
        // Bucket doesn't exist, try to create
        console.log(`🆕 Creating bucket: ${bucket.name}`);
        const { data, error } = await supabase.storage.createBucket(bucket.name, bucket.options);

        if (error) {
          console.error(`❌ Failed to create bucket ${bucket.name}:`, error);
          process.exit(1);
        }

        console.log(`✅ Bucket ${bucket.name} created successfully`);
      } else {
        console.log(`✅ Bucket ${bucket.name} already exists`);
      }

      // Set up bucket policies
      console.log(`🔒 Configuring policies for ${bucket.name}`);
      const { error: policyError } = await supabase.storage.updateBucketPolicy(bucket.name, {
        'public': false,
        'download': 'authenticated',
        'insert': 'authenticated',
        'update': 'authenticated',
        'delete': 'authenticated'
      });

      if (policyError) {
        console.error(`❌ Failed to set policies for ${bucket.name}:`, policyError);
        process.exit(1);
      }

      console.log(`🎉 Bucket ${bucket.name} setup completed`);
    }

    console.log('🚀 All storage buckets configured successfully!');

  } catch (err) {
    console.error('❌ Unexpected storage setup error:', err);
    process.exit(1);
  }
}

setupStorageBucket();
