#!/bin/bash

echo "🚀 Feature Commit Helper"
echo "========================"
echo "Enter feature name:"
read feature
echo "Enter description:"
read description

git add .
git commit -m "feat: $feature

$description"
git push origin main

echo "✅ Feature '$feature' committed and pushed!"
