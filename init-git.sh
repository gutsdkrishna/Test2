#!/bin/bash

# Initialize Git repository for BoostIQ Pro project
echo "🚀 Initializing Git repository for BoostIQ Pro..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git and try again."
    exit 1
fi

# Initialize the repository
git init

# Add all files to staging
git add .

# Create an initial commit
git commit -m "Initial commit: BoostIQ Pro project setup"

# Setup instructions
echo "✅ Git repository initialized successfully!"
echo ""
echo "Next steps:"
echo "1. Create a repository on GitHub, GitLab, or your preferred Git hosting service"
echo "2. Connect your local repository with the remote:"
echo "   git remote add origin <repository-url>"
echo "3. Push your code to the remote repository:"
echo "   git push -u origin main"

echo ""
echo "🎉 Your BoostIQ Pro project is now version controlled with Git!"
