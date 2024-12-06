#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ConfigManager {
  static generateSecureConfig() {
    const configPath = path.resolve(__dirname, '../.env');
    const exampleConfigPath = path.resolve(__dirname, '../.env.example');

    // Check if .env file exists
    if (fs.existsSync(configPath)) {
      console.error('🚨 Existing configuration found. Skipping generation.');
      return;
    }

    // Read example configuration
    const exampleConfig = fs.readFileSync(exampleConfigPath, 'utf8');

    // Generate secure random values
    const secureConfig = exampleConfig
      .replace('your_anonymous_key', this.generateSecureToken())
      .replace('your_service_role_key', this.generateSecureToken())
      .replace('StrongPassword123!@#', this.generateStrongPassword());

    // Write secure configuration
    fs.writeFileSync(configPath, secureConfig);
    console.log('✅ Secure configuration generated successfully');
  }

  static generateSecureToken(length = 64) {
    return crypto.randomBytes(length).toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, length);
  }

  static generateStrongPassword(length = 24) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let password = '';
    const randomBytes = crypto.randomBytes(length);
    
    for (let i = 0; i < length; i++) {
      password += charset[randomBytes[i] % charset.length];
    }
    
    return password;
  }
}

// Run configuration generation
ConfigManager.generateSecureConfig();
