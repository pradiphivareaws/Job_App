import { supabase } from '../utils/supabase.js';

export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      recruiter_id: req.user.id
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
};

export const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      jobType,
      experienceLevel,
      skills
    } = req.query;

    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from('jobs')
      .select('*, profiles!jobs_recruiter_id_fkey(full_name, company_name, avatar_url)', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,company_name.ilike.%${search}%`);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (jobType) {
      query = query.eq('job_type', jobType);
    }

    if (experienceLevel) {
      query = query.eq('experience_level', experienceLevel);
    }

    if (skills) {
      const skillsArray = skills.split(',');
      query = query.overlaps('required_skills', skillsArray);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      jobs: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to get jobs' });
  }
};

export const getJob = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('jobs')
      .select('*, profiles!jobs_recruiter_id_fkey(full_name, company_name, company_website, avatar_url)')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Failed to get job' });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates.id;
    delete updates.recruiter_id;
    delete updates.created_at;
    delete updates.views_count;
    delete updates.applications_count;

    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    const { data, error, count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .eq('recruiter_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      jobs: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ error: 'Failed to get jobs' });
  }
};
