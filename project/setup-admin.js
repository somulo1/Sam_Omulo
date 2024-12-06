const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function setupAdmin() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'StrongAdminPassword123!';

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Sign up the admin user
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });

    if (error) {
      console.error('Error creating admin user:', error.message);
      process.exit(1);
    }

    console.log('Admin user created successfully:', data.user);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

setupAdmin();
