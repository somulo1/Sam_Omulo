const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function checkStorageBuckets() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('❌ Missing Supabase configuration');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false
    }
  });

  try {
    console.log('🔍 Checking Supabase storage buckets...');

    // List all buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('❌ Failed to list buckets:', listError);
      process.exit(1);
    }

    console.log('📦 Existing Buckets:');
    buckets.forEach(bucket => {
      console.log(`- ${bucket.name}`);
    });

    // Check specific buckets
    const requiredBuckets = ['portfolio-images', 'profile-photos'];
    
    for (const bucketName of requiredBuckets) {
      const { data, error } = await supabase.storage.getBucket(bucketName);

      if (error) {
        console.error(`❌ Bucket "${bucketName}" does not exist:`, error);
      } else {
        console.log(`✅ Bucket "${bucketName}" exists`);
        console.log('   Bucket Details:', JSON.stringify(data, null, 2));
      }
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

checkStorageBuckets();
