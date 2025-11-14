/*
  # Job Portal Database Schema

  ## Overview
  Complete database schema for a job portal application with support for job seekers, 
  recruiters, and admin users.

  ## New Tables
  
  ### 1. profiles
  Extended user profiles linked to Supabase auth.users
  - `id` (uuid, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `role` (enum: 'job_seeker', 'recruiter', 'admin')
  - `phone` (text)
  - `location` (text)
  - `bio` (text)
  - `avatar_url` (text)
  - `resume_url` (text)
  - `skills` (text array)
  - `experience_years` (integer)
  - `education` (jsonb)
  - `company_name` (text, for recruiters)
  - `company_website` (text)
  - `is_verified` (boolean)
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. jobs
  Job postings created by recruiters
  - `id` (uuid, primary key)
  - `recruiter_id` (uuid, references profiles)
  - `title` (text)
  - `description` (text)
  - `company_name` (text)
  - `location` (text)
  - `job_type` (enum: 'full_time', 'part_time', 'contract', 'internship')
  - `experience_level` (enum: 'entry', 'mid', 'senior', 'lead')
  - `salary_min` (integer)
  - `salary_max` (integer)
  - `salary_currency` (text)
  - `required_skills` (text array)
  - `benefits` (text array)
  - `application_deadline` (timestamptz)
  - `is_active` (boolean)
  - `views_count` (integer)
  - `applications_count` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. applications
  Job applications submitted by job seekers
  - `id` (uuid, primary key)
  - `job_id` (uuid, references jobs)
  - `applicant_id` (uuid, references profiles)
  - `cover_letter` (text)
  - `resume_url` (text)
  - `status` (enum: 'pending', 'reviewing', 'shortlisted', 'rejected', 'accepted')
  - `notes` (text, for recruiter notes)
  - `applied_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. saved_jobs
  Jobs saved by job seekers for later
  - `id` (uuid, primary key)
  - `job_id` (uuid, references jobs)
  - `user_id` (uuid, references profiles)
  - `created_at` (timestamptz)

  ### 5. notifications
  System notifications for users
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `title` (text)
  - `message` (text)
  - `type` (enum: 'application', 'job_update', 'message', 'system')
  - `is_read` (boolean)
  - `created_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies for job seekers, recruiters, and admins
  - Users can only access their own data
  - Recruiters can manage their own jobs and view applicants
  - Admins have full access
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('job_seeker', 'recruiter', 'admin');
CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract', 'internship');
CREATE TYPE experience_level AS ENUM ('entry', 'mid', 'senior', 'lead');
CREATE TYPE application_status AS ENUM ('pending', 'reviewing', 'shortlisted', 'rejected', 'accepted');
CREATE TYPE notification_type AS ENUM ('application', 'job_update', 'message', 'system');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role user_role DEFAULT 'job_seeker' NOT NULL,
  phone text,
  location text,
  bio text,
  avatar_url text,
  resume_url text,
  skills text[] DEFAULT '{}',
  experience_years integer DEFAULT 0,
  education jsonb DEFAULT '[]',
  company_name text,
  company_website text,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  company_name text NOT NULL,
  location text NOT NULL,
  job_type job_type NOT NULL,
  experience_level experience_level NOT NULL,
  salary_min integer,
  salary_max integer,
  salary_currency text DEFAULT 'USD',
  required_skills text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  application_deadline timestamptz,
  is_active boolean DEFAULT true,
  views_count integer DEFAULT 0,
  applications_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter text,
  resume_url text NOT NULL,
  status application_status DEFAULT 'pending',
  notes text,
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, applicant_id)
);

-- Saved jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(job_id, user_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type notification_type NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter ON jobs(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment job views
CREATE OR REPLACE FUNCTION increment_job_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs SET views_count = views_count + 1 WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update application count
CREATE OR REPLACE FUNCTION update_applications_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE jobs SET applications_count = applications_count + 1 WHERE id = NEW.job_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE jobs SET applications_count = applications_count - 1 WHERE id = OLD.job_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_applications_count
AFTER INSERT OR DELETE ON applications
FOR EACH ROW EXECUTE FUNCTION update_applications_count();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all active profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Recruiters can insert jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('recruiter', 'admin')
    )
  );

CREATE POLICY "Recruiters can update own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (
    recruiter_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    recruiter_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Recruiters can delete own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (
    recruiter_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Applications policies
CREATE POLICY "Applicants can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    applicant_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.recruiter_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Job seekers can insert applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (
    applicant_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'job_seeker'
    )
  );

CREATE POLICY "Applicants can update own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    applicant_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.recruiter_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    applicant_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.recruiter_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Saved jobs policies
CREATE POLICY "Users can view own saved jobs"
  ON saved_jobs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own saved jobs"
  ON saved_jobs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own saved jobs"
  ON saved_jobs FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);