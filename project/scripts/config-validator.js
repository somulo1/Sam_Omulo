#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

class ConfigValidator {
  static validateConfig() {
    const configPath = path.resolve(__dirname, '../.env');
    
    // Check if .env file exists
    if (!fs.existsSync(configPath)) {
      console.error('❌ No .env file found. Please create one using .env.example as a template.');
      process.exit(1);
    }

    // Load environment variables
    const config = dotenv.config({ path: configPath }).parsed;

    // Validation rules
    const validationRules = [
      {
        key: 'VITE_SUPABASE_URL',
        validate: (value) => value && value.includes('supabase.co'),
        errorMessage: 'Invalid Supabase URL'
      },
      {
        key: 'VITE_SUPABASE_ANON_KEY',
        validate: (value) => value && value.split('.').length === 3,
        errorMessage: 'Invalid Supabase Anonymous Key'
      },
      {
        key: 'ADMIN_EMAIL',
        validate: (value) => value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        errorMessage: 'Invalid admin email format'
      },
      {
        key: 'ADMIN_PASSWORD',
        validate: (value) => {
          const minLength = 12;
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumbers = /[0-9]/.test(value);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

          return (
            value.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChar
          );
        },
        errorMessage: 'Password does not meet security requirements'
      }
    ];

    // Perform validation
    let hasErrors = false;
    validationRules.forEach(rule => {
      const value = config[rule.key];
      if (!rule.validate(value)) {
        console.error(`❌ ${rule.key}: ${rule.errorMessage}`);
        hasErrors = true;
      }
    });

    // Check for default or example values
    const defaultValueChecks = [
      { key: 'VITE_SUPABASE_URL', defaultValue: '[YOUR_PROJECT_ID]' },
      { key: 'VITE_SUPABASE_ANON_KEY', defaultValue: 'EXAMPLE_TOKEN_REPLACE_ME' },
      { key: 'ADMIN_EMAIL', defaultValue: 'admin@yourdomain.com' },
      { key: 'ADMIN_PASSWORD', defaultValue: 'ComplexPassword123!@#Change' }
    ];

    defaultValueChecks.forEach(check => {
      if (config[check.key] === check.defaultValue) {
        console.error(`❌ ${check.key}: Contains default example value. Please replace with your actual configuration.`);
        hasErrors = true;
      }
    });

    if (hasErrors) {
      console.error('🚨 Configuration validation failed. Please review and update your .env file.');
      process.exit(1);
    }

    console.log('✅ Configuration validated successfully');
  }
}

// Run configuration validation
ConfigValidator.validateConfig();
