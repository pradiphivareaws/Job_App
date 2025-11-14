-- Seed SQL for Job_App
-- Run this in the Supabase SQL editor (SQL > New query) against your project

-- Ensure pgcrypto for gen_random_uuid()
create extension if not exists "pgcrypto";

-- Profiles
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

-- Jobs
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text,
  location text,
  description text,
  salary text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- Applications
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade,
  applicant_id uuid references profiles(id) on delete cascade,
  status text default 'applied',
  cover_letter text,
  created_at timestamptz default now()
);

-- Saved jobs
create table if not exists saved_jobs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  constraint unique_user_job unique(user_id, job_id)
);

-- Notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text,
  message text,
  read boolean default false,
  created_at timestamptz default now()
);

-- SAMPLE DATA (adjust or remove as needed)
-- Insert sample profiles
insert into profiles (id, username, full_name, avatar_url, bio)
values
  ('11111111-1111-4111-8111-111111111111', 'alice', 'Alice Anderson', null, 'Full-stack dev'),
  ('22222222-2222-4222-8222-222222222222', 'bob', 'Bob Brown', null, 'Backend engineer'),
  ('33333333-3333-4333-8333-333333333333', 'carol', 'Carol Clark', null, 'Product manager')
on conflict (id) do nothing;

-- Insert sample jobs
insert into jobs (id, title, company, location, description, salary, created_by)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Frontend Engineer', 'Acme Inc', 'Remote', 'Work on React + Vite frontend', '$80k-120k', '11111111-1111-4111-8111-111111111111'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Backend Engineer', 'Beta LLC', 'NYC', 'Node.js + Postgres APIs', '$90k-130k', '22222222-2222-4222-8222-222222222222')
on conflict (id) do nothing;

-- Additional default jobs
insert into jobs (id, title, company, location, description, salary, created_by)
values
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Full Stack Engineer', 'Gamma Co', 'Remote', 'Work across frontend and backend (React, Node)', '$100k-140k', '11111111-1111-4111-8111-111111111111'),
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'Data Scientist', 'Delta Data', 'San Francisco, CA', 'Models, analytics, and data pipelines', '$120k-160k', '33333333-3333-4333-8333-333333333333'),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'DevOps Engineer', 'OpsWorks', 'London, UK', 'CI/CD, infrastructure as code, monitoring', '$110k-150k', '22222222-2222-4222-8222-222222222222')
on conflict (id) do nothing;

-- Insert sample applications
insert into applications (id, job_id, applicant_id, status, cover_letter)
values
  ('aaaaaaaa-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33333333-3333-4333-8333-333333333333', 'applied', 'I am excited to apply!'),
  ('bbbbbbbb-0000-4000-8000-000000000002', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '11111111-1111-4111-8111-111111111111', 'interview', 'Looking forward to chatting')
on conflict (id) do nothing;

-- Insert sample saved_jobs
insert into saved_jobs (id, job_id, user_id)
values
  ('dddddddd-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '22222222-2222-4222-8222-222222222222')
on conflict (id) do nothing;

-- Insert sample notifications
insert into notifications (id, user_id, type, message, read)
values
  ('eeeeeeee-0000-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', 'application', 'Your application has been received', false)
on conflict (id) do nothing;

-- Helpful indexes
create index if not exists idx_jobs_created_at on jobs (created_at);
create index if not exists idx_profiles_username on profiles (username);
