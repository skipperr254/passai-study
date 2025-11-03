-- =====================================================
-- PassAI Storage Setup - Materials Bucket
-- Version: 00002
-- Date: 2025-11-02
-- Description: Create storage bucket and policies for file uploads
-- =====================================================

-- =====================================================
-- CREATE MATERIALS BUCKET
-- =====================================================

-- Insert materials bucket (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'materials',
  'materials',
  false, -- Private bucket
  52428800, -- 50MB in bytes
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 52428800,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =====================================================
-- STORAGE POLICIES
-- File structure: {user_id}/{subject_id}/{filename}
-- =====================================================

-- Policy 1: Users can upload their own materials
CREATE POLICY "Users can upload materials"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'materials' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Users can read their own materials
CREATE POLICY "Users can read materials"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'materials' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Users can update their own materials
CREATE POLICY "Users can update materials"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'materials' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Users can delete their own materials
CREATE POLICY "Users can delete materials"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'materials' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check bucket was created
DO $$
DECLARE
  bucket_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO bucket_count
  FROM storage.buckets
  WHERE id = 'materials';
  
  IF bucket_count > 0 THEN
    RAISE NOTICE '✅ Storage bucket "materials" created successfully';
  ELSE
    RAISE NOTICE '❌ Failed to create storage bucket';
  END IF;
END $$;

-- Check policies were created
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%materials%';
  
  RAISE NOTICE '✅ Created % storage policies', policy_count;
END $$;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE storage.buckets IS 'Storage buckets for file uploads';

-- =====================================================
-- STORAGE SETUP COMPLETE
-- =====================================================

RAISE NOTICE '✅ Storage setup complete! Bucket: materials (50MB limit, private access)';
