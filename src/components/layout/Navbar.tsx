import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <Briefcase className="w-6 h-6" />
            JobPortal
          </Link>

          {user && profile ? (
            <div className="flex items-center gap-6">
              {profile.role === 'job_seeker' && (
                <>
                  <Link to="/jobs" className="text-gray-700 hover:text-blue-600 transition">
                    Browse Jobs
                  </Link>
                  <Link to="/applications" className="text-gray-700 hover:text-blue-600 transition">
                    My Applications
                  </Link>
                  <Link to="/saved-jobs" className="text-gray-700 hover:text-blue-600 transition">
                    Saved Jobs
                  </Link>
                </>
              )}

              {profile.role === 'recruiter' && (
                <>
                  <Link to="/recruiter/jobs" className="text-gray-700 hover:text-blue-600 transition">
                    My Jobs
                  </Link>
                  <Link to="/recruiter/post-job" className="text-gray-700 hover:text-blue-600 transition">
                    Post Job
                  </Link>
                </>
              )}

              {profile.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition">
                  Admin Panel
                </Link>
              )}

              <Link to="/notifications" className="text-gray-700 hover:text-blue-600 transition">
                <Bell className="w-5 h-5" />
              </Link>

              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
                  <User className="w-5 h-5" />
                  <span>{profile.full_name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/signin"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
