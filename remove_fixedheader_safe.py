import sys

with open('./src/app/page.tsx.original', 'r') as f:
    lines = f.readlines()

output = []
i = 0
while i < len(lines):
    # Check if this line starts the FixedHeader function
    if lines[i].strip() == 'function FixedHeader() {':
        # Skip until we find the matching closing brace
        brace_count = 1
        i += 1
        while i < len(lines) and brace_count > 0:
            if '{' in lines[i]:
                brace_count += 1
            if '}' in lines[i]:
                brace_count -= 1
            i += 1
        continue
    
    # Remove any <FixedHeader /> calls
    if '<FixedHeader />' in lines[i]:
        i += 1
        continue
    
    output.append(lines[i])
    i += 1

# Write the cleaned file
with open('./src/app/page.tsx.fixed', 'w') as f:
    f.writelines(output)

print(f"Original: {len(lines)} lines")
print(f"Fixed: {len(output)} lines")
print("FixedHeader removed successfully")
