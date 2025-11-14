import { supabase } from '../utils/supabase.js';

export const applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter, resumeUrl } = req.body;

    const { data: existingApp } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('applicant_id', req.user.id)
      .maybeSingle();

    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    const { data, error } = await supabase
      .from('applications')
      .insert({
        job_id: jobId,
        applicant_id: req.user.id,
        cover_letter: coverLetter,
        resume_url: resumeUrl
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { data: job } = await supabase
      .from('jobs')
      .select('title, recruiter_id')
      .eq('id', jobId)
      .single();

    if (job) {
      await supabase
        .from('notifications')
        .insert({
          user_id: job.recruiter_id,
          title: 'New Application',
          message: `You have a new application for ${job.title}`,
          type: 'application'
        });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({ error: 'Failed to apply to job' });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from('applications')
      .select(`
        *,
        jobs (
          id,
          title,
          company_name,
          location,
          job_type,
          salary_min,
          salary_max,
          salary_currency
        )
      `, { count: 'exact' })
      .eq('applicant_id', req.user.id)
      .order('applied_at', { ascending: false })
      .range(from, to);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      applications: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to get applications' });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    const { data: job } = await supabase
      .from('jobs')
      .select('recruiter_id')
      .eq('id', jobId)
      .single();

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.recruiter_id !== req.user.id && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view these applications' });
    }

    let query = supabase
      .from('applications')
      .select(`
        *,
        profiles!applications_applicant_id_fkey (
          id,
          full_name,
          email,
          phone,
          location,
          skills,
          experience_years,
          avatar_url
        )
      `, { count: 'exact' })
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false })
      .range(from, to);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      applications: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ error: 'Failed to get applications' });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const { data: application } = await supabase
      .from('applications')
      .select('job_id, applicant_id')
      .eq('id', id)
      .single();

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { data: job } = await supabase
      .from('jobs')
      .select('recruiter_id, title')
      .eq('id', application.job_id)
      .single();

    if (job.recruiter_id !== req.user.id && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    const { data, error } = await supabase
      .from('applications')
      .update({ status, notes })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    await supabase
      .from('notifications')
      .insert({
        user_id: application.applicant_id,
        title: 'Application Update',
        message: `Your application for ${job.title} has been ${status}`,
        type: 'application'
      });

    res.json(data);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
      .eq('applicant_id', req.user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ error: 'Failed to withdraw application' });
  }
};
