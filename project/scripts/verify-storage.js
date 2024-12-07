import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the project root
dotenv.config({ path: resolve(__dirname, '..', '.env') });

async function verifyStorage() {
  console.log('🔍 Verifying Supabase Storage Configuration');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('❌ Missing Supabase configuration');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  const buckets = ['portfolio-images', 'profile-photos'];

  for (const bucketName of buckets) {
    console.log(`\n📦 Checking bucket: ${bucketName}`);

    try {
      // Get bucket details
      const { data: bucket, error: bucketError } = await supabase
        .storage
        .getBucket(bucketName);

      if (bucketError) {
        console.error(`❌ Error getting bucket ${bucketName}:`, bucketError);
        continue;
      }

      console.log('✅ Bucket exists');
      console.log('Configuration:');
      console.log('- Public:', bucket?.public ? '✅' : '❌');
      console.log('- Allowed MIME Types:', bucket?.allowedMimeTypes?.join(', ') || 'All types allowed');
      console.log('- File Size Limit:', bucket?.fileSizeLimit ? (bucket.fileSizeLimit / 1024 / 1024).toFixed(1) + 'MB' : 'Default limit');

      // List files in bucket
      const { data: files, error: listError } = await supabase
        .storage
        .from(bucketName)
        .list();

      if (listError) {
        console.error('❌ Failed to list files:', listError);
      } else {
        console.log('✅ Can list files');
        console.log(`- Current files: ${files.length}`);
      }

      // Try to upload a test file
      const testContent = new Uint8Array([0x89, 0x50, 0x4E, 0x47]); // PNG header
      const { error: uploadError } = await supabase
        .storage
        .from(bucketName)
        .upload('test.png', testContent, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) {
        console.error('❌ Upload test failed:', uploadError);
      } else {
        console.log('✅ Upload test successful');

        // Clean up test file
        const { error: deleteError } = await supabase
          .storage
          .from(bucketName)
          .remove(['test.png']);

        if (deleteError) {
          console.error('❌ Cleanup failed:', deleteError);
        } else {
          console.log('✅ Cleanup successful');
        }
      }

      // Test public URL generation
      const { data: urlData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl('test-image.jpg');

      if (urlData?.publicUrl) {
        console.log('✅ Public URL generation works');
        console.log('Sample URL format:', urlData.publicUrl);
      }

    } catch (error) {
      console.error(`❌ Unexpected error checking bucket ${bucketName}:`, error);
    }
  }

  console.log('\n🎉 Storage verification completed');
}

verifyStorage().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
