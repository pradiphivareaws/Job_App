import express from 'express';
import { supabase, supabaseAdmin } from '../utils/supabase.js';

const router = express.Router();

// Development-only helper routes. Enabled when DEV_ALLOW_DEV_ROUTES=true in env.
router.get('/profiles', async (req, res) => {
  try {
    const client = supabaseAdmin || supabase;
    const { data, error } = await client.from('profiles').select('*');
    if (error) return res.status(500).json({ error: error.message || error });
    res.json(data);
  } catch (err) {
    console.error('Dev GET /profiles error:', err);
    res.status(500).json({ error: 'Dev route failed' });
  }
});

export default router;
