# Job Portal - Setup Instructions

A full-stack job portal application with React frontend, Node.js/Express backend, and Supabase for database and authentication.

## Features

### For Job Seekers
- Browse and search jobs with advanced filtering
- Save jobs for later viewing
- Apply to jobs with resume and cover letter
- Track application status
- Manage profile and upload resume
- View notifications

### For Recruiters
- Post and manage job listings
- View job applications
- Update application status
- Track job views and application counts
- Communicate with applicants

### For Admins
- Manage all users
- Moderate job postings
- View platform statistics
- Verify users

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, React Router
- **Backend**: Node.js, Express, JWT authentication
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for resumes)
- **Deployment**: Docker, Docker Compose

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)
- Supabase account

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. The database schema has already been applied via migration
3. Set up Supabase Storage bucket for resumes:
   - Go to Storage in Supabase dashboard
   - Create a new public bucket named `resumes`
   - Set appropriate policies for authenticated users

4. Get your Supabase credentials:
   - Project URL
   - Anon (public) key
   - Service role key (keep this secret!)

### 2. Local Development Setup

#### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at http://localhost:5173

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your credentials:
   ```
   PORT=3001
   NODE_ENV=development
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The API will be available at http://localhost:3001

### 3. Docker Deployment

1. Create a `.env` file in the root directory with all required variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

2. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

4. Stop the containers:
   ```bash
   docker-compose down
   ```

## Project Structure

```
job-portal/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── jobs/          # Job-related components
│   │   │   ├── layout/        # Layout components
│   │   │   └── ...
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilities and configs
│   │   ├── pages/             # Page components
│   │   ├── types/             # TypeScript types
│   │   └── App.tsx            # Main app component
│   ├── Dockerfile.frontend
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Utility functions
│   │   └── server.js          # Express server
│   ├── Dockerfile
│   └── package.json
├── supabase/
│   └── migrations/            # Database migrations
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - List all jobs (with filters)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create new job (recruiters only)
- `PUT /api/jobs/:id` - Update job (recruiter/admin)
- `DELETE /api/jobs/:id` - Delete job (recruiter/admin)
- `GET /api/jobs/my-jobs` - Get recruiter's jobs

### Applications
- `POST /api/applications` - Apply to a job
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/job/:jobId` - Get job applications (recruiter)
- `PATCH /api/applications/:id/status` - Update application status
- `DELETE /api/applications/:id` - Withdraw application

### Profile
- `GET /api/profiles/:id` - Get profile
- `PUT /api/profiles/:id` - Update profile
- `POST /api/profiles/resume` - Upload resume

### Saved Jobs
- `POST /api/saved-jobs` - Save a job
- `GET /api/saved-jobs` - Get saved jobs
- `DELETE /api/saved-jobs/:jobId` - Remove saved job

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/jobs` - Get all jobs
- `GET /api/admin/stats` - Get platform statistics
- `PATCH /api/admin/users/:userId/status` - Update user status
- `DELETE /api/admin/users/:userId` - Delete user

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read

## Security Features

- JWT-based authentication via Supabase
- Row Level Security (RLS) policies on all tables
- Role-based access control (Job Seeker, Recruiter, Admin)
- Secure file uploads to Supabase Storage
- Input validation on all endpoints
- Rate limiting on API endpoints
- CORS protection
- Helmet.js security headers

## Default User Roles

When signing up, users can choose:
- **Job Seeker**: Can browse jobs, apply, and manage applications
- **Recruiter**: Can post jobs and manage applications
- **Admin**: Full access (must be set manually in database)

## Troubleshooting

### Frontend doesn't load
- Check that environment variables are set correctly
- Ensure Supabase URL and keys are valid
- Check browser console for errors

### Backend connection issues
- Verify backend is running on port 3001
- Check Supabase credentials in backend .env
- Review backend logs for errors

### Database errors
- Ensure migrations have been applied in Supabase
- Check RLS policies are configured correctly
- Verify Supabase project is active

### Resume upload fails
- Ensure Supabase Storage bucket 'resumes' exists
- Check bucket is set to public
- Verify storage policies allow authenticated uploads

## Production Deployment

1. Set `NODE_ENV=production` in backend
2. Use environment-specific Supabase projects
3. Enable SSL/HTTPS
4. Set up proper CORS origins
5. Use production-grade secrets
6. Set up monitoring and logging
7. Configure backup strategies

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
