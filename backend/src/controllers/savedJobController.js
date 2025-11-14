import { supabase } from '../utils/supabase.js';

export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const { data, error } = await supabase
      .from('saved_jobs')
      .insert({
        job_id: jobId,
        user_id: req.user.id
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Job already saved' });
      }
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ error: 'Failed to save job' });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    const { data, error, count } = await supabase
      .from('saved_jobs')
      .select(`
        *,
        jobs (
          id,
          title,
          description,
          company_name,
          location,
          job_type,
          experience_level,
          salary_min,
          salary_max,
          salary_currency,
          created_at
        )
      `, { count: 'exact' })
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      savedJobs: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({ error: 'Failed to get saved jobs' });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('job_id', jobId)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Job removed from saved list' });
  } catch (error) {
    console.error('Unsave job error:', error);
    res.status(500).json({ error: 'Failed to unsave job' });
  }
};
