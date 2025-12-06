import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Find and fix the header line with incorrect syntax
# Pattern: <header followed by line with conditional without className=
pattern = r'(<header\s*\n\s*)isScrolled \? "bg-\[#1E4259\] shadow-lg" : "bg-transparent"(\s*\n\s*\} h-16\`\})'

# Replacement with proper syntax
replacement = r'\1className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 ${\nisScrolled ? "bg-[#1E4259] shadow-lg" : "bg-transparent"\n}`}'

fixed_content = re.sub(pattern, replacement, content)

# Write back
with open('src/app/page.tsx', 'w') as f:
    f.write(fixed_content)

print("Fixed syntax error in header")
