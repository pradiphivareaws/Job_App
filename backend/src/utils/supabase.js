import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function validateEnv() {
	const missing = [];
	if (!supabaseUrl) missing.push('SUPABASE_URL');
	if (!supabaseAnonKey) missing.push('SUPABASE_ANON_KEY (or SUPABASE_KEY / VITE_SUPABASE_ANON_KEY)');
	if (missing.length) {
		const msg = `Missing required environment variable(s): ${missing.join(', ')}.\n` +
			`Add them to your .env or set them in the environment before starting the app.`;
		// Print to stderr and throw so container fails fast with a clear message
		console.error(msg);
		throw new Error(msg);
	}
}

validateEnv();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;
