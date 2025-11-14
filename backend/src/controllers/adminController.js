import { supabaseAdmin } from '../utils/supabase.js';

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    let query = supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (role) {
      query = query.eq('role', role);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      users: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive, isVerified } = req.body;

    const updates = {};
    if (typeof isActive !== 'undefined') updates.is_active = isActive;
    if (typeof isVerified !== 'undefined') updates.is_verified = isVerified;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    let query = supabaseAdmin
      .from('jobs')
      .select('*, profiles!jobs_recruiter_id_fkey(full_name, email, company_name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
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
    console.error('Get all jobs error:', error);
    res.status(500).json({ error: 'Failed to get jobs' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Auth delete error:', authError);
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const getStats = async (req, res) => {
  try {
    const { data: totalUsers } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    const { data: jobSeekers } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'job_seeker');

    const { data: recruiters } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'recruiter');

    const { data: totalJobs } = await supabaseAdmin
      .from('jobs')
      .select('id', { count: 'exact', head: true });

    const { data: activeJobs } = await supabaseAdmin
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    const { data: totalApplications } = await supabaseAdmin
      .from('applications')
      .select('id', { count: 'exact', head: true });

    res.json({
      totalUsers: totalUsers?.length || 0,
      jobSeekers: jobSeekers?.length || 0,
      recruiters: recruiters?.length || 0,
      totalJobs: totalJobs?.length || 0,
      activeJobs: activeJobs?.length || 0,
      totalApplications: totalApplications?.length || 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
};
