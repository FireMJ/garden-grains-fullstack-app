#!/bin/bash

# Quick commit script for daily development
timestamp=$(date '+%Y-%m-%d %H:%M:%S')
git add .
git commit -m "Dev update: $timestamp - $1"
git push origin main
echo "✅ Changes committed and pushed!"
