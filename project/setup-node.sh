#!/bin/bash

# Update and install system dependencies
apt-get update
apt-get install -y curl git

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Navigate to project directory
cd /home/somulo/Downloads/project-bolt-sb1-4pnnd5/project

# Install project dependencies
npm install @supabase/supabase-js dotenv

# Run authentication setup
node /home/somulo/Downloads/project-bolt-sb1-4pnnd5/project/auth-setup.js
