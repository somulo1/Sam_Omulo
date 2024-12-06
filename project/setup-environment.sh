#!/bin/bash

# Update package lists
sudo apt-get update

# Install curl and other necessary tools
sudo apt-get install -y curl software-properties-common

# Install Node.js and npm
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Install project dependencies
npm install

# Create admin user script
node create-admin-user.js
