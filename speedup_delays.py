import re

# Read index.html
with open(r'c:\MY_PROJECTS\HP\Simulator\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Function to scale the delay
def scale_delay(match):
    original_delay = int(match.group(1))
    new_delay = int(original_delay * 0.6) # Make it 40% faster
    return f'data-delay="{new_delay}"'

# Replace data-delay values
new_content = re.sub(r'data-delay="(\d+)"', scale_delay, content)

# Write back
with open(r'c:\MY_PROJECTS\HP\Simulator\index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated data-delays successfully!")
