# JobPortal - Full-Stack Job Board Application

A modern, full-featured job portal built with React, Node.js/Express, and Supabase. This application connects job seekers with recruiters, featuring advanced search, real-time notifications, and a complete admin panel.

## Features

### For Job Seekers
- Browse jobs with advanced filtering (location, type, skills, experience level)
- Search jobs by title, description, or company
- Save jobs for later viewing
- Apply to jobs with resume and cover letter
- Track application status in real-time
- Upload and manage resume
- Receive notifications on application updates
- Build comprehensive profile with skills and experience

### For Recruiters
- Post and manage job listings
- View and filter job applications
- Update application status (pending, reviewing, shortlisted, rejected, accepted)
- Track job performance (views, applications count)
- Activate/deactivate job postings
- Add notes to applications
- Manage company profile

### For Admins
- User management (view, verify, activate/deactivate)
- Job moderation
- Platform analytics and statistics
- Full access to all features

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Supabase Client** for authentication and database

### Backend
- **Node.js** with Express
- **Supabase** for PostgreSQL database
- **JWT authentication** via Supabase Auth
- **Express middleware**: helmet, cors, rate-limit
- **Input validation** with express-validator

### Database & Storage
- **Supabase PostgreSQL** with Row Level Security (RLS)
- **Supabase Storage** for resume files
- Comprehensive database schema with indexes
- Automated triggers for counts and timestamps

### DevOps
- **Docker** and **Docker Compose** for containerization
- **Nginx** for frontend routing
- Production-ready configuration

## Quick Start

### Prerequisites
- Node.js 18+
- npm
- Supabase account
- Docker (optional, for containerized deployment)

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. The database migrations have already been applied
3. Get your credentials from Project Settings > API:
   - Project URL
   - Anon (public) key
   - Service role key

### 3. Set Up Environment Variables

**Frontend (.env in root):**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend (backend/.env):**
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run Locally

**Terminal 1 - Frontend:**
```bash
npm run dev
# Runs on http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

### 5. Run with Docker

```bash
# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

## Project Structure

```
job-portal/
├── src/                          # Frontend source
│   ├── components/
│   │   ├── auth/                 # Authentication components
│   │   ├── layout/               # Layout components (Navbar, etc.)
│   │   ├── jobs/                 # Job-related components
│   │   ├── applications/         # Application components
│   │   ├── profile/              # Profile components
│   │   └── admin/                # Admin panel components
│   ├── contexts/                 # React contexts
│   │   └── AuthContext.tsx       # Authentication state
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities and configs
│   │   └── supabase.ts           # Supabase client
│   ├── pages/                    # Page components
│   │   ├── HomePage.tsx
│   │   ├── JobsPage.tsx
│   │   ├── JobDetailPage.tsx
│   │   ├── ApplicationsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── RecruiterDashboard.tsx
│   │   └── PostJobPage.tsx
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx                   # Main app component with routing
│   └── main.tsx                  # Application entry point
├── backend/
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── jobController.js
│   │   │   ├── applicationController.js
│   │   │   ├── profileController.js
│   │   │   ├── savedJobController.js
│   │   │   ├── adminController.js
│   │   │   └── notificationController.js
│   │   ├── middleware/           # Express middleware
│   │   │   ├── auth.js           # Authentication & authorization
│   │   │   └── validation.js     # Input validation
│   │   ├── routes/               # API routes
│   │   │   ├── auth.js
│   │   │   ├── jobs.js
│   │   │   ├── applications.js
│   │   │   ├── profile.js
│   │   │   ├── savedJobs.js
│   │   │   ├── admin.js
│   │   │   └── notifications.js
│   │   ├── utils/                # Utility functions
│   │   │   └── supabase.js       # Supabase admin client
│   │   └── server.js             # Express server setup
│   ├── Dockerfile                # Backend Docker config
│   └── package.json
├── supabase/
│   └── migrations/               # Database migrations (already applied)
├── docker-compose.yml            # Multi-container setup
├── Dockerfile.frontend           # Frontend Docker config
├── nginx.conf                    # Nginx configuration
└── SETUP.md                      # Detailed setup guide
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/me` - Get current user profile

### Job Endpoints
- `GET /api/jobs` - List jobs (with pagination & filters)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (recruiter only)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/my-jobs` - Get recruiter's jobs

### Application Endpoints
- `POST /api/applications` - Submit job application
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/job/:jobId` - Get job's applications (recruiter)
- `PATCH /api/applications/:id/status` - Update application status
- `DELETE /api/applications/:id` - Withdraw application

### Profile Endpoints
- `GET /api/profiles/:id` - Get user profile
- `PUT /api/profiles/:id` - Update profile
- `POST /api/profiles/resume` - Upload resume

### Saved Jobs Endpoints
- `POST /api/saved-jobs` - Save job
- `GET /api/saved-jobs` - Get saved jobs
- `DELETE /api/saved-jobs/:jobId` - Unsave job

### Admin Endpoints
- `GET /api/admin/users` - List all users
- `GET /api/admin/jobs` - List all jobs
- `GET /api/admin/stats` - Get platform statistics
- `PATCH /api/admin/users/:userId/status` - Update user status
- `DELETE /api/admin/users/:userId` - Delete user

### Notification Endpoints
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all as read

## Database Schema

### Tables
- **profiles** - Extended user profiles with role-based access
- **jobs** - Job listings with recruiter relationships
- **applications** - Job applications with status tracking
- **saved_jobs** - User's saved job listings
- **notifications** - System notifications

### Security
- Row Level Security (RLS) enabled on all tables
- Role-based access control (job_seeker, recruiter, admin)
- Secure file upload policies
- JWT-based authentication

## Key Features Explained

### Authentication Flow
- Supabase Auth handles user registration and login
- JWT tokens for secure API access
- Automatic profile creation on signup
- Role-based routing and permissions

### Job Search & Filtering
- Full-text search across title, description, company
- Filter by location, job type, experience level, skills
- Pagination for performance
- Real-time job view tracking

### Application Management
- Resume upload to Supabase Storage
- Cover letter support
- Status tracking (pending → reviewing → shortlisted/rejected/accepted)
- Recruiter notes on applications
- Automatic notifications on status changes

### File Upload
- Secure resume storage in Supabase Storage
- Support for PDF, DOC, DOCX formats
- 5MB file size limit
- Public access for recruiters to view

## Security Best Practices

- All API endpoints protected with authentication
- RLS policies prevent unauthorized data access
- Input validation on all forms
- Rate limiting on API endpoints
- Helmet.js for security headers
- CORS configuration
- Passwords hashed by Supabase Auth
- Service role key kept server-side only

## Testing Users

After setup, create test users:

1. **Job Seeker**: Sign up with role "job_seeker"
2. **Recruiter**: Sign up with role "recruiter"
3. **Admin**: Create user, then manually update role in Supabase dashboard

## Troubleshooting

### Frontend won't load
- Verify environment variables are set
- Check Supabase URL and keys are correct
- Clear browser cache and restart dev server

### Backend connection errors
- Ensure backend is running on correct port
- Check Supabase credentials in backend/.env
- Review console logs for specific errors

### Resume upload fails
- Verify Supabase Storage bucket 'resumes' exists
- Check storage policies are configured
- Ensure file size is under 5MB

### Database errors
- Confirm migrations were applied successfully
- Check RLS policies in Supabase dashboard
- Verify user roles are set correctly

## Production Deployment

1. Set up production Supabase project
2. Configure environment variables for production
3. Set `NODE_ENV=production`
4. Use SSL/HTTPS
5. Configure proper CORS origins
6. Set up monitoring and logging
7. Enable Supabase backups

## Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

## License

MIT

---

**Built with ❤️ using React, Node.js, and Supabase**
