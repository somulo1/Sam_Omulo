const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

async function createAdminUser() {
  // Validate environment variables
  const requiredEnvVars = [
    'VITE_SUPABASE_URL', 
    'VITE_SUPABASE_ANON_KEY', 
    'ADMIN_EMAIL', 
    'ADMIN_PASSWORD'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Attempt to sign up the admin user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });

    // Handle signup errors
    if (signUpError) {
      // If user already exists, attempt to sign in
      if (signUpError.message.includes('User already exists')) {
        console.log('Admin user already exists. Attempting to sign in...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        });

        if (signInError) {
          console.error('Failed to sign in existing admin user:', signInError.message);
          process.exit(1);
        }

        console.log('Successfully signed in existing admin user');
        return;
      }

      // Other signup errors
      console.error('Admin user signup failed:', signUpError.message);
      process.exit(1);
    }

    // Successful signup
    if (signUpData.user) {
      console.log('Admin user created successfully:', signUpData.user.email);
      
      // Optional: Log user details securely
      console.log('User ID:', signUpData.user.id);
    }
  } catch (err) {
    console.error('Unexpected error during admin user creation:', err);
    process.exit(1);
  }
}

// Run the function
createAdminUser();
