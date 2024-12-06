#!/bin/bash

# Update package lists
apt-get update

# Install necessary tools
apt-get install -y curl git

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify Node.js and npm
node --version
npm --version

# Navigate to project directory
cd /home/somulo/Downloads/project-bolt-sb1-4pnnd5/project

# Install project dependencies
npm install

# Run authentication setup
node auth-setup.js
