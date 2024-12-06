#!/bin/bash

# Exit on any error
set -e

# Update system packages
apt-get update
apt-get install -y curl git

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs npm

# Navigate to project directory
cd /home/somulo/Downloads/project-bolt-sb1-4pnnd5/project

# Install project dependencies
npm install

# Generate secure configuration
npm run config:generate

# Validate configuration
npm run config:validate

# Set up authentication
npm run auth-setup

# Set up storage
npm run setup-storage

echo "🎉 Project setup completed successfully!"
