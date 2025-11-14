/*
  # Setup Supabase Storage for Resumes

  ## Overview
  Configure storage bucket and policies for resume file uploads.

  ## Storage Setup
  1. Create a public bucket named 'resumes'
  2. Set up policies for authenticated users to upload their resumes
  3. Allow public read access to resumes (for recruiters to view)

  ## Security
  - Only authenticated users can upload files
  - Users can only upload to their own folder
  - Files are publicly readable once uploaded
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  true,
  5242880,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated users can update own resumes"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'resumes'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'resumes'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view resumes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resumes');

CREATE POLICY "Users can delete own resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes'
  AND auth.uid()::text = (storage.foldername(name))[1]
);