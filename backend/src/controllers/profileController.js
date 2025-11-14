import { supabase } from '../utils/supabase.js';

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (id !== req.user.id) {
      return res.status(403).json({ error: 'Cannot update other users profiles' });
    }

    const updates = req.body;
    delete updates.id;
    delete updates.created_at;
    delete updates.email;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const { resumeUrl } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({ resume_url: resumeUrl })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
};
