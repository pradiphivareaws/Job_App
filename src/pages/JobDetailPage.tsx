import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, Building, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Job } from '../types';

export const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJob();
      checkIfSaved();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, profiles!jobs_recruiter_id_fkey(full_name, company_name, company_website)')
        .eq('id', id)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('job_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      setIsSaved(!!data);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveJob = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    try {
      if (isSaved) {
        await supabase.from('saved_jobs').delete().eq('job_id', id).eq('user_id', user.id);
        setIsSaved(false);
      } else {
        await supabase.from('saved_jobs').insert({ job_id: id, user_id: user.id });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleApply = async () => {
    if (!user || !profile) {
      navigate('/signin');
      return;
    }

    if (!profile.resume_url) {
      alert('Please upload your resume in your profile first');
      navigate('/profile');
      return;
    }

    try {
      setApplying(true);
      const { error } = await supabase.from('applications').insert({
        job_id: id,
        applicant_id: user.id,
        cover_letter: coverLetter,
        resume_url: profile.resume_url,
      });

      if (error) throw error;

      alert('Application submitted successfully!');
      setShowApplyModal(false);
      navigate('/applications');
    } catch (error: any) {
      console.error('Error applying:', error);
      alert(error.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-600">{job.company_name}</p>
            </div>
            {profile?.role === 'job_seeker' && (
              <button
                onClick={handleSaveJob}
                className={`p-3 rounded-lg border ${
                  isSaved ? 'bg-yellow-50 border-yellow-300' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Star className={`w-5 h-5 ${isSaved ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="w-5 h-5" />
              <span>{job.job_type.replace('_', ' ')}</span>
            </div>
            {job.salary_min && job.salary_max && (
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-5 h-5" />
                <span>
                  {job.salary_currency} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>{new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {profile?.role === 'job_seeker' && (
            <button
              onClick={() => setShowApplyModal(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Apply Now
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        {job.required_skills.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.required_skills.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.benefits.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {job.benefits.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-4">Apply for {job.title}</h3>
            <p className="text-gray-600 mb-4">Your resume will be submitted with this application</p>

            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a cover letter (optional)"
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
