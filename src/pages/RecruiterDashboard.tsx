import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Users as UsersIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Job } from '../types';

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('recruiter_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ is_active: !currentStatus })
        .eq('id', jobId);

      if (error) throw error;
      fetchMyJobs();
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Job Postings</h1>
          <Link
            to="/recruiter/post-job"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Post New Job
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg mb-4">No jobs posted yet</p>
            <Link
              to="/recruiter/post-job"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          job.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {job.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{job.company_name} • {job.location}</p>

                    <div className="flex gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {job.views_count} views
                      </span>
                      <span className="flex items-center gap-1">
                        <UsersIcon className="w-4 h-4" />
                        {job.applications_count} applications
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/recruiter/jobs/${job.id}/applications`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      View Applications
                    </Link>
                    <button
                      onClick={() => toggleJobStatus(job.id, job.is_active)}
                      className={`px-4 py-2 rounded-lg transition ${
                        job.is_active
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {job.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
