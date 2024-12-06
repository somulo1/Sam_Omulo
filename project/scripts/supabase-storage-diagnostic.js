import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runSupabaseDiagnostic() {
  console.log('🔍 Starting Supabase Storage Diagnostic');

  // Retrieve credentials
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  // Validate credentials
  console.log('📋 Credential Check:');
  console.log(`- Supabase URL: ${supabaseUrl ? '✅ Present' : '❌ Missing'}`);
  console.log(`- Service Role Key: ${supabaseServiceRoleKey ? '✅ Present' : '❌ Missing'}`);
  console.log(`- Anon Key: ${supabaseAnonKey ? '✅ Present' : '❌ Missing'}`);

  if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseAnonKey) {
    console.error('❌ Missing critical Supabase configuration');
    process.exit(1);
  }

  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false
    }
  });

  try {
    // Specific bucket checks
    const requiredBuckets = ['profile-photos', 'portfolio-images'];
    
    for (const bucketName of requiredBuckets) {
      console.log(`\n🔍 Checking bucket: ${bucketName}`);
      
      try {
        // Try to get bucket information
        const { data, error } = await supabase.storage.from(bucketName).list('', { 
          limit: 1, 
          offset: 0 
        });

        if (error) {
          console.log(`❌ Bucket "${bucketName}" may not exist or is inaccessible:`, error);
          
          // Attempt to create the bucket
          console.log(`🆕 Attempting to create bucket: ${bucketName}`);
          const createResponse = await supabase.storage.createBucket(bucketName, {
            public: false,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            fileSizeLimit: bucketName === 'profile-photos' ? 5 * 1024 * 1024 : 10 * 1024 * 1024
          });

          if (createResponse.error) {
            console.error(`❌ Failed to create bucket ${bucketName}:`, createResponse.error);
          } else {
            console.log(`✅ Bucket ${bucketName} created successfully`);
          }
        } else {
          console.log(`✅ Bucket "${bucketName}" exists`);
          console.log('   Bucket Contents:', data);
        }

      } catch (bucketError) {
        console.error(`❌ Unexpected error checking bucket ${bucketName}:`, bucketError);
      }
    }

    console.log('\n🎉 Supabase Storage Diagnostic Completed Successfully');

  } catch (err) {
    console.error('❌ Unexpected diagnostic error:', err);
    process.exit(1);
  }
}

runSupabaseDiagnostic();
