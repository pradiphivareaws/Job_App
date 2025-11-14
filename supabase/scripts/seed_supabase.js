#!/usr/bin/env node
// Simple seeding script for Supabase using the REST API
// Usage:
//  SUPABASE_URL="https://...supabase.co" SUPABASE_ANON_KEY="anon..." node supabase/scripts/seed_supabase.js
// If you have dotenv installed, it will auto-load a .env file.

(async () => {
  try {
    // Try to load dotenv if available (optional)
    try { require('dotenv').config(); } catch(e) { /* ignore if not installed */ }

    const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
    const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
    const SUPABASE_ANON_KEY = (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim();

    // CLI flag to require service role key
    const requireServiceRole = process.argv.includes('--use-service-role');

    // Prefer service role key when present (safer for server-side seeding / when RLS is enabled)
    const KEY_IN_USE = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !KEY_IN_USE) {
      console.error('Missing SUPABASE_URL or SUPABASE key. Provide them as env vars.');
      console.error('Set $env:SUPABASE_URL and $env:SUPABASE_SERVICE_ROLE_KEY or $env:SUPABASE_ANON_KEY');
      process.exit(1);
    }

    if (requireServiceRole && !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Flag --use-service-role specified but SUPABASE_SERVICE_ROLE_KEY not provided.');
      process.exit(1);
    }

    const usingServiceRole = Boolean(SUPABASE_SERVICE_ROLE_KEY);
    const masked = (s) => s ? s.slice(0,8) + '...' + s.slice(-4) : '<missing>';
    console.log('Supabase URL:', SUPABASE_URL);
    console.log('Using key type:', usingServiceRole ? 'service_role' : 'anon/public');
    console.log('Key preview:', usingServiceRole ? masked(SUPABASE_SERVICE_ROLE_KEY) : masked(SUPABASE_ANON_KEY));

    const headers = {
      'Content-Type': 'application/json',
      apikey: KEY_IN_USE,
      Authorization: `Bearer ${KEY_IN_USE}`,
      Prefer: 'return=representation'
    };

    async function post(table, rows) {
      const url = `${SUPABASE_URL.replace(/\/+$|\/+$/,'')}/rest/v1/${table}`;
      const resp = await fetch(url, { method: 'POST', headers, body: JSON.stringify(rows) });
      const text = await resp.text();
      let body;
      try { body = JSON.parse(text); } catch { body = text; }
      if (!resp.ok) {
        console.error(`Error inserting into ${table}:`, resp.status, body);
        throw new Error('Insert failed');
      }
      console.log(`Inserted into ${table}:`, body);
      return body;
    }

    // Sample payloads matching seed_data.sql
    const profiles = [
      { id: '11111111-1111-4111-8111-111111111111', username: 'alice', full_name: 'Alice Anderson', bio: 'Full-stack dev' },
      { id: '22222222-2222-4222-8222-222222222222', username: 'bob', full_name: 'Bob Brown', bio: 'Backend engineer' },
      { id: '33333333-3333-4333-8333-333333333333', username: 'carol', full_name: 'Carol Clark', bio: 'Product manager' }
    ];

    const jobs = [
      { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', title: 'Frontend Engineer', company: 'Acme Inc', location: 'Remote', description: 'Work on React + Vite frontend', salary: '$80k-120k', created_by: '11111111-1111-4111-8111-111111111111' },
      { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', title: 'Backend Engineer', company: 'Beta LLC', location: 'NYC', description: 'Node.js + Postgres APIs', salary: '$90k-130k', created_by: '22222222-2222-4222-8222-222222222222' }
    ];

    // Additional default jobs
    const moreJobs = [
      { id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', title: 'Full Stack Engineer', company: 'Gamma Co', location: 'Remote', description: 'Work across frontend and backend (React, Node)', salary: '$100k-140k', created_by: '11111111-1111-4111-8111-111111111111' },
      { id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', title: 'Data Scientist', company: 'Delta Data', location: 'San Francisco, CA', description: 'Models, analytics, and data pipelines', salary: '$120k-160k', created_by: '33333333-3333-4333-8333-333333333333' },
      { id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', title: 'DevOps Engineer', company: 'OpsWorks', location: 'London, UK', description: 'CI/CD, infrastructure as code, monitoring', salary: '$110k-150k', created_by: '22222222-2222-4222-8222-222222222222' }
    ];

    // merge arrays for insertion
    const allJobs = jobs.concat(moreJobs);

    const applications = [
      { id: 'aaaaaaaa-0000-4000-8000-000000000001', job_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', applicant_id: '33333333-3333-4333-8333-333333333333', status: 'applied', cover_letter: 'I am excited to apply!' },
      { id: 'bbbbbbbb-0000-4000-8000-000000000002', job_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', applicant_id: '11111111-1111-4111-8111-111111111111', status: 'interview', cover_letter: 'Looking forward to chatting' }
    ];

    const saved_jobs = [
      { id: 'dddddddd-0000-4000-8000-000000000003', job_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', user_id: '22222222-2222-4222-8222-222222222222' }
    ];

    const notifications = [
      { id: 'eeeeeeee-0000-4000-8000-000000000004', user_id: '11111111-1111-4111-8111-111111111111', type: 'application', message: 'Your application has been received', read: false }
    ];

    // Insert in order (profiles -> jobs -> others)
    await post('profiles', profiles);
    await post('jobs', allJobs);
    await post('applications', applications);
    await post('saved_jobs', saved_jobs);
    await post('notifications', notifications);

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
})();
