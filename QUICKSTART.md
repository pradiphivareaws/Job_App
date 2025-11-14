# JobPortal - Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)
- Git (to clone if needed)

## Step 1: Get Supabase Credentials (2 minutes)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project (or use existing)
3. Wait for project to be ready
4. Go to **Project Settings** → **API**
5. Copy these values:
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

## Step 2: Set Up Environment (1 minute)

### Option A: Automated Setup

```bash
# Run the setup script
./setup.sh

# Follow the prompts to create and configure .env files
```

### Option B: Manual Setup

**Create `.env` in project root:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Create `backend/.env`:**
```bash
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 3: Install Dependencies (2 minutes)

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

## Step 4: Run the Application

### Option A: Local Development (Recommended for development)

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Frontend runs at: http://localhost:5173

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs at: http://localhost:3001

### Option B: Docker (Recommended for production-like testing)

```bash
# Make sure Docker is running
docker-compose up --build
```
Application runs at: http://localhost:3000

## Step 5: Create Your First User

1. Open http://localhost:5173 (or http://localhost:3000 for Docker)
2. Click **Sign Up**
3. Choose your role:
   - **Job Seeker** - to browse and apply for jobs
   - **Recruiter** - to post jobs and hire talent
4. Fill in your details and create account
5. You're in! 🎉

## What's Next?

### As a Job Seeker:
1. Complete your profile → Click profile icon → **Profile Settings**
2. Upload your resume
3. Browse jobs → **Browse Jobs** in navbar
4. Apply to interesting positions
5. Track your applications → **My Applications**

### As a Recruiter:
1. Post your first job → **Post Job** in navbar
2. View applications → **My Jobs** → Select job → **View Applications**
3. Update application status
4. Manage your job postings

### As an Admin:
1. Change your role in Supabase:
   - Go to Supabase Dashboard
   - Table Editor → profiles
   - Find your user → Edit → Change role to `admin`
2. Access admin panel → **Admin Panel** in navbar
3. View platform statistics
4. Manage users and jobs

## Common Issues

### "Failed to connect to database"
- Check your Supabase credentials in `.env` files
- Ensure your Supabase project is active
- Verify the URLs don't have trailing slashes

### "Resume upload failed"
- The Supabase Storage bucket has been set up via migration
- If issues persist, check Supabase Dashboard → Storage
- Ensure bucket `resumes` exists and is public

### Frontend won't load
- Make sure you're in the project root directory
- Check that `npm install` completed successfully
- Try clearing browser cache

### Backend errors
- Verify all environment variables are set in `backend/.env`
- Check that backend port 3001 isn't already in use
- Review terminal logs for specific error messages

## Quick Commands Reference

```bash
# Start frontend dev server
npm run dev

# Start backend dev server
cd backend && npm run dev

# Build frontend for production
npm run build

# Run with Docker
docker-compose up --build

# Stop Docker
docker-compose down

# View Docker logs
docker-compose logs -f

# Run setup script
./setup.sh
```

## Project URLs (Local Development)

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Project URLs (Docker)

- **Application**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Test the API

```bash
# Health check
curl http://localhost:3001/health

# Response: {"status":"ok","timestamp":"..."}
```

## Need More Help?

- **Detailed Setup**: See [SETUP.md](SETUP.md)
- **Full Documentation**: See [README.md](README.md)
- **Project Structure**: See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

## Congratulations! 🎉

You now have a fully functional job portal running locally!

Start exploring, posting jobs, or applying to positions. The application includes:
- ✅ User authentication with role-based access
- ✅ Job posting and management
- ✅ Application tracking
- ✅ Resume uploads
- ✅ Real-time notifications
- ✅ Admin panel
- ✅ And much more!

Happy coding! 🚀
