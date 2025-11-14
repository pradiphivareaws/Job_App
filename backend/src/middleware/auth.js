import { supabase } from '../utils/supabase.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7);

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (error || !profile) {
        return res.status(403).json({ error: 'Profile not found' });
      }

      if (!allowedRoles.includes(profile.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      req.userRole = profile.role;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(403).json({ error: 'Authorization failed' });
    }
  };
};
