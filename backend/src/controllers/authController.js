import { supabase, supabaseAdmin } from '../utils/supabase.js';

export const signUp = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role || 'job_seeker'
        }
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          role: role || 'job_seeker'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    res.status(201).json({
      user: data.user,
      session: data.session,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      user: data.user,
      session: data.session,
      profile
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ error: 'Failed to sign in' });
  }
};

export const signOut = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Sign out error:', error);
    res.status(500).json({ error: 'Failed to sign out' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ user: req.user, profile });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
};
