"""
Script to split single-page VoxVerse website into multiple HTML files
"""

import re

# Read the original index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract header (everything before <main>)
header_match = re.search(r'(<!DOCTYPE html>.*?<main class="page-content"[^>]*>)', content, re.DOTALL)
header = header_match.group(1) if header_match else ''

# Update header navigation to use .html files
header = header.replace('href="#home1" onclick="navigateTo(\'home1\')"', 'href="index.html"')
header = header.replace('href="#home2" onclick="navigateTo(\'home2\')"', 'href="home2.html"')
header = header.replace('href="#about" onclick="navigateTo(\'about\')"', 'href="about.html"')
header = header.replace('href="#services" onclick="navigateTo(\'services\')"', 'href="services.html"')
header = header.replace('href="#talent" onclick="navigateTo(\'talent\')"', 'href="talent.html"')
header = header.replace('href="#audiobook" onclick="navigateTo(\'audiobook\')"', 'href="audiobook.html"')
header = header.replace('href="#localization" onclick="navigateTo(\'localization\')"', 'href="localization.html"')
header = header.replace('href="#contact" onclick="navigateTo(\'contact\')"', 'href="contact.html"')

# Remove onclick attributes from header
header = re.sub(r' onclick="navigateTo\([^)]+\)"', '', header)

# Extract footer (everything after </main>)
footer_match = re.search(r'(</main>.*?</html>)', content, re.DOTALL)
footer = footer_match.group(1) if footer_match else ''

# Define page sections with their IDs
pages = {
    'index.html': 'page-home1',
    'home2.html': 'page-home2',
    'about.html': 'page-about',
    'services.html': 'page-services',
    'talent.html': 'page-talent',
    'audiobook.html': 'page-audiobook',
    'localization.html': 'page-localization',
    'contact.html': 'page-contact'
}

# Extract and create each page
for filename, page_id in pages.items():
    print(f'Creating {filename}...')
    
    # Find the page content
    pattern = rf'<div id="{page_id}"[^>]*>(.*?)</div>\s*(?=<div id="page-|<!-- ===)'
    match = re.search(pattern, content, re.DOTALL)
    
    if match:
        page_content = match.group(1)
        
        # Update internal navigation links in page content
        page_content = re.sub(r'href="#(\w+)" onclick="navigateTo\(\'(\w+)\'\)"', 
                             lambda m: f'href="{m.group(1) if m.group(1) == "contact" else m.group(1)}.html"' 
                             if m.group(1) not in ['home1', 'home2', 'about', 'services', 'talent', 'audiobook', 'localization', 'contact'] 
                             else f'href="{"index" if m.group(1) == "home1" else m.group(1)}.html"',
                             page_content)
        
        # Fix specific navigation links
        page_content = page_content.replace('href="#home1"', 'href="index.html"')
        page_content = page_content.replace('href="#home2"', 'href="home2.html"')
        page_content = page_content.replace('href="#about"', 'href="about.html"')
        page_content = page_content.replace('href="#services"', 'href="services.html"')
        page_content = page_content.replace('href="#talent"', 'href="talent.html"')
        page_content = page_content.replace('href="#audiobook"', 'href="audiobook.html"')
        page_content = page_content.replace('href="#localization"', 'href="localization.html"')
        page_content = page_content.replace('href="#contact"', 'href="contact.html"')
        
        # Remove remaining onclick attributes
        page_content = re.sub(r' onclick="navigateTo\([^)]+\)"', '', page_content)
        
        # Combine header + content + footer
        full_page = header + '\n' + page_content + '\n' + footer
        
        # Write the file
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(full_page)
        
        print(f'✓ Created {filename}')
    else:
        print(f'✗ Could not find content for {page_id}')

print('\n✓ All pages created successfully!')
print('Files created: index.html, home2.html, about.html, services.html, talent.html, audiobook.html, localization.html, contact.html')
