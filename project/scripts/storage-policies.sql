-- Enable Row Level Security for storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a policy for authenticated users to allow uploads
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects
FOR INSERT
USING (auth.role() = 'authenticated');

-- Policy for profile-photos bucket
-- Allow authenticated users to upload, read, update, and delete their own files
CREATE OR REPLACE POLICY "Users can upload their own profile photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' 
  AND bucket_id = (SELECT id FROM storage.buckets WHERE name = 'profile-photos')
  AND (
    -- Optional: Add additional user-specific checks if needed
    auth.uid()::text = metadata->>'userId'
  )
);

-- Policy for reading profile photos
CREATE OR REPLACE POLICY "Users can read profile photos" 
ON storage.objects 
FOR SELECT 
USING (
  auth.role() = 'authenticated'
  AND bucket_id = (SELECT id FROM storage.buckets WHERE name = 'profile-photos')
);

-- Policy for updating profile photos
CREATE OR REPLACE POLICY "Users can update their own profile photos" 
ON storage.objects 
FOR UPDATE 
USING (
  auth.role() = 'authenticated'
  AND bucket_id = (SELECT id FROM storage.buckets WHERE name = 'profile-photos')
  AND auth.uid()::text = metadata->>'userId'
);

-- Policy for deleting profile photos
CREATE OR REPLACE POLICY "Users can delete their own profile photos" 
ON storage.objects 
FOR DELETE 
USING (
  auth.role() = 'authenticated'
  AND bucket_id = (SELECT id FROM storage.buckets WHERE name = 'profile-photos')
  AND auth.uid()::text = metadata->>'userId'
);

-- Similar policies for portfolio-images bucket
CREATE OR REPLACE POLICY "Users can upload portfolio images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' 
  AND bucket_id = (SELECT id FROM storage.buckets WHERE name = 'portfolio-images')
  AND (
    -- Optional: Add additional user-specific checks if needed
    auth.uid()::text = metadata->>'userId'
  )
);

CREATE OR REPLACE POLICY "Users can read portfolio images" 
ON storage.objects 
FOR SELECT 
USING (
  auth.role() = 'authenticated'
  AND bucket_id = (SELECT id FROM storage.buckets WHERE name = 'portfolio-images')
);

CREATE OR REPLACE POLICY "Users can update their portfolio images" 
ON storage.objects 
FOR UPDATE 
USING (
  auth.role() = 'authenticated'
  AND bucket_id = (SELECT id FROM storage.buckets WHERE name = 'portfolio-images')
  AND auth.uid()::text = metadata->>'userId'
);

CREATE OR REPLACE POLICY "Users can delete their portfolio images" 
ON storage.objects 
FOR DELETE 
USING (
  auth.role() = 'authenticated'
  AND bucket_id = (SELECT id FROM storage.buckets WHERE name = 'portfolio-images')
  AND auth.uid()::text = metadata->>'userId'
);
