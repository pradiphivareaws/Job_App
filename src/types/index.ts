export type UserRole = 'job_seeker' | 'recruiter' | 'admin';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead';
export type ApplicationStatus = 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';
export type NotificationType = 'application' | 'job_update' | 'message' | 'system';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  resume_url?: string;
  skills: string[];
  experience_years: number;
  education: any[];
  company_name?: string;
  company_website?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  recruiter_id: string;
  title: string;
  description: string;
  company_name: string;
  location: string;
  job_type: JobType;
  experience_level: ExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  required_skills: string[];
  benefits: string[];
  application_deadline?: string;
  is_active: boolean;
  views_count: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_letter?: string;
  resume_url: string;
  status: ApplicationStatus;
  notes?: string;
  applied_at: string;
  updated_at: string;
  jobs?: Job;
  profiles?: Profile;
}

export interface SavedJob {
  id: string;
  job_id: string;
  user_id: string;
  created_at: string;
  jobs?: Job;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}
