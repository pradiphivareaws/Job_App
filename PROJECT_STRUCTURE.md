# JobPortal Project Structure

```
job-portal/
│
├── Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── SignIn.tsx                 # Sign in form
│   │   │   │   ├── SignUp.tsx                 # Sign up form with role selection
│   │   │   │   └── ProtectedRoute.tsx         # Route protection wrapper
│   │   │   └── layout/
│   │   │       └── Navbar.tsx                 # Navigation bar with role-based menu
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx                # Authentication state management
│   │   │
│   │   ├── lib/
│   │   │   └── supabase.ts                    # Supabase client configuration
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.tsx                   # Landing page
│   │   │   ├── JobsPage.tsx                   # Job listings with search & filters
│   │   │   ├── JobDetailPage.tsx              # Job details & apply modal
│   │   │   ├── ApplicationsPage.tsx           # Job seeker's applications
│   │   │   ├── ProfilePage.tsx                # User profile & resume upload
│   │   │   ├── RecruiterDashboard.tsx         # Recruiter's job management
│   │   │   └── PostJobPage.tsx                # Create new job posting
│   │   │
│   │   ├── types/
│   │   │   └── index.ts                       # TypeScript type definitions
│   │   │
│   │   ├── App.tsx                            # Main app with routing
│   │   ├── main.tsx                           # App entry point
│   │   └── index.css                          # TailwindCSS imports
│   │
│   ├── index.html                             # HTML template
│   ├── package.json                           # Frontend dependencies
│   ├── vite.config.ts                         # Vite configuration
│   ├── tailwind.config.js                     # TailwindCSS config
│   ├── tsconfig.json                          # TypeScript config
│   ├── Dockerfile.frontend                    # Frontend Docker image
│   ├── nginx.conf                             # Nginx configuration
│   ├── .env.example                           # Frontend env template
│   └── .dockerignore                          # Docker ignore patterns
│
├── Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js              # Auth: signup, signin, signout
│   │   │   ├── jobController.js               # CRUD operations for jobs
│   │   │   ├── applicationController.js       # Application management
│   │   │   ├── profileController.js           # Profile & resume handling
│   │   │   ├── savedJobController.js          # Save/unsave jobs
│   │   │   ├── adminController.js             # Admin: users, jobs, stats
│   │   │   └── notificationController.js      # Notification management
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js                        # JWT authentication & role check
│   │   │   └── validation.js                  # Input validation wrapper
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js                        # /api/auth routes
│   │   │   ├── jobs.js                        # /api/jobs routes
│   │   │   ├── applications.js                # /api/applications routes
│   │   │   ├── profile.js                     # /api/profiles routes
│   │   │   ├── savedJobs.js                   # /api/saved-jobs routes
│   │   │   ├── admin.js                       # /api/admin routes
│   │   │   └── notifications.js               # /api/notifications routes
│   │   │
│   │   ├── utils/
│   │   │   └── supabase.js                    # Supabase client & admin client
│   │   │
│   │   └── server.js                          # Express server setup
│   │
│   ├── package.json                           # Backend dependencies
│   ├── Dockerfile                             # Backend Docker image
│   ├── .env.example                           # Backend env template
│   └── .dockerignore                          # Docker ignore patterns
│
├── Supabase Configuration
│   └── migrations/                            # Already applied migrations
│       ├── create_job_portal_schema           # Main database schema
│       └── setup_storage_for_resumes          # Storage bucket & policies
│
├── Docker Configuration
│   ├── docker-compose.yml                     # Multi-container orchestration
│   └── .env.docker.example                    # Docker env template
│
├── Documentation
│   ├── README.md                              # Main documentation
│   ├── SETUP.md                               # Detailed setup guide
│   └── PROJECT_STRUCTURE.md                   # This file
│
└── Scripts
    └── setup.sh                               # Interactive setup script

```

## Database Schema (Supabase)

### Tables

1. **profiles**
   - Extended user information
   - Role: job_seeker, recruiter, admin
   - Links to auth.users

2. **jobs**
   - Job postings by recruiters
   - Includes salary, location, skills, benefits
   - Tracks views and application counts

3. **applications**
   - Job applications with status tracking
   - Links jobs to applicants
   - Includes cover letter and notes

4. **saved_jobs**
   - Users' saved job listings
   - Many-to-many relationship

5. **notifications**
   - System notifications for users
   - Read/unread tracking

### Storage Buckets

1. **resumes**
   - Public bucket for resume files
   - PDF, DOC, DOCX support
   - 5MB file size limit

## Key Files Explained

### Frontend

**App.tsx**
- Main routing configuration
- Protected route setup
- Auth state management integration

**AuthContext.tsx**
- Global authentication state
- Sign in/up/out functions
- Profile data management
- Supabase auth integration

**Navbar.tsx**
- Role-based navigation
- Dynamic menu items
- User profile dropdown

**JobsPage.tsx**
- Job listing with pagination
- Search and filter functionality
- Real-time job updates

**JobDetailPage.tsx**
- Full job information
- Application submission
- Save job functionality

**ProfilePage.tsx**
- User profile editing
- Resume upload to Supabase Storage
- Skills and experience management

**RecruiterDashboard.tsx**
- Recruiter's job listings
- Job activation/deactivation
- View statistics

### Backend

**server.js**
- Express app setup
- Middleware configuration
- Route registration
- Error handling

**authController.js**
- User registration with profile creation
- JWT token authentication
- Session management

**jobController.js**
- Job CRUD operations
- Advanced filtering and pagination
- Job ownership verification

**applicationController.js**
- Application submission
- Status updates with notifications
- Application filtering for recruiters

**auth.js (middleware)**
- JWT token verification
- Role-based access control
- User session validation

### Docker

**docker-compose.yml**
- Frontend service (Nginx)
- Backend service (Node.js)
- Network configuration
- Environment variables

**Dockerfile.frontend**
- Multi-stage build
- Vite build optimization
- Nginx serving

**Dockerfile (backend)**
- Node.js production setup
- Dependency optimization
- Health check endpoint

## API Request Flow

1. **User Authentication**
   ```
   Client → Supabase Auth → JWT Token → API Request → Backend Middleware → Controller
   ```

2. **Job Application**
   ```
   Client → Upload Resume (Storage) → API Request → Validate → Create Application →
   Update Job Count → Send Notification → Return Success
   ```

3. **Job Search**
   ```
   Client → API Request with Filters → Query Builder → Database (RLS) →
   Pagination → Response with Jobs
   ```

## Security Layers

1. **Frontend**
   - Protected routes
   - Role-based UI rendering
   - Input validation

2. **Backend**
   - JWT authentication
   - Role-based middleware
   - Input validation
   - Rate limiting

3. **Database**
   - Row Level Security (RLS)
   - Policies per table
   - Role-based access

4. **Storage**
   - Upload policies
   - File type validation
   - Size limits

## Environment Variables

### Required for Frontend
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

### Required for Backend
- `PORT` - Backend port (default: 3001)
- `NODE_ENV` - development/production
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (admin access)

## Development Workflow

1. **Local Development**
   ```bash
   # Terminal 1: Frontend
   npm run dev

   # Terminal 2: Backend
   cd backend && npm run dev
   ```

2. **Docker Development**
   ```bash
   docker-compose up --build
   ```

3. **Production Build**
   ```bash
   npm run build
   cd backend && npm start
   ```

## Testing Users

Create test accounts for each role:

1. **Job Seeker** - Browse and apply to jobs
2. **Recruiter** - Post and manage jobs
3. **Admin** - Full platform access (set role manually in Supabase)

## Deployment Checklist

- [ ] Set up production Supabase project
- [ ] Configure production environment variables
- [ ] Enable SSL/HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure Supabase backups
- [ ] Set up monitoring and logging
- [ ] Test all user flows
- [ ] Configure rate limiting
- [ ] Set up CI/CD pipeline
- [ ] Document API endpoints

---

For detailed setup instructions, see [SETUP.md](SETUP.md)

For general information, see [README.md](README.md)
