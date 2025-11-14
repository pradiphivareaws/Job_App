import { Link } from 'react-router-dom';
import { Briefcase, Users, Building, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const HomePage = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Find Your Dream Career</h1>
            <p className="text-xl mb-8 text-blue-100">
              Connect with top employers and discover opportunities that match your skills
            </p>
            {!profile ? (
              <div className="flex gap-4 justify-center">
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
                >
                  Get Started
                </Link>
                <Link
                  to="/jobs"
                  className="bg-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 transition border border-blue-500"
                >
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <Link
                to="/jobs"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
              >
                Browse Jobs
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">1000+</h3>
            <p className="text-gray-600">Active Jobs</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">5000+</h3>
            <p className="text-gray-600">Job Seekers</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-600">Companies</p>
          </div>
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">95%</h3>
            <p className="text-gray-600">Success Rate</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {profile?.role === 'recruiter' ? 'Post Your Job Today' : 'Ready to Take the Next Step?'}
          </h2>
          <p className="text-gray-700 mb-6">
            {profile?.role === 'recruiter'
              ? 'Connect with thousands of qualified candidates'
              : 'Join thousands of professionals finding their perfect job'}
          </p>
          <Link
            to={profile?.role === 'recruiter' ? '/recruiter/post-job' : '/signup'}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {profile?.role === 'recruiter' ? 'Post a Job' : 'Sign Up Now'}
          </Link>
        </div>
      </div>
    </div>
  );
};
