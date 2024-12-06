const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

async function promptForCredentials() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve, reject) => {
    rl.question('Enter admin email: ', (email) => {
      rl.question('Enter admin password: ', (password) => {
        rl.close();
        
        // Validate inputs
        if (!email || !password) {
          console.error('❌ Email and password are required');
          process.exit(1);
        }

        resolve({ email, password });
      });
    });
  });
}

async function setupAuthentication() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Validate critical inputs
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('❌ Missing Supabase configuration');
    process.exit(1);
  }

  // Prompt for admin credentials securely
  const { email: adminEmail, password: adminPassword } = await promptForCredentials();

  // Password complexity check
  const validatePassword = (password) => {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };

  if (!validatePassword(adminPassword)) {
    console.error('❌ Password does not meet security requirements:');
    console.error('- At least 12 characters long');
    console.error('- Contains uppercase letters');
    console.error('- Contains lowercase letters');
    console.error('- Contains numbers');
    console.error('- Contains special characters');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false
    }
  });

  try {
    console.log('🔐 Setting up secure admin user...');

    // Create or update admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        is_primary_admin: true
      }
    });

    if (error) {
      console.error('❌ Failed to create admin user:', error.message);
      process.exit(1);
    }

    console.log(`✅ Admin user established: ${data.user.email}`);
    console.log(`🆔 User ID: ${data.user.id}`);
  } catch (err) {
    console.error('❌ Unexpected authentication setup error:', err);
    process.exit(1);
  }
}

setupAuthentication();
