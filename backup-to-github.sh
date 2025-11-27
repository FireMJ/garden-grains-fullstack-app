#!/bin/bash

# Garden Grains - Backup to GitHub Script
echo "🚀 Backing up Garden Grains project to GitHub..."

# Get current date for commit message
current_date=$(date +"%Y-%m-%d %H:%M:%S")

# Add all changes
git add .

# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    echo "✅ No changes to commit - everything is up to date!"
else
    # Commit changes
    git commit -m "Backup: $current_date - Automatic project backup"
    
    # Push to GitHub
    git push origin main
    
    echo "✅ Successfully backed up to GitHub on $current_date"
fi

echo "📊 Current project status:"
git log --oneline -5
