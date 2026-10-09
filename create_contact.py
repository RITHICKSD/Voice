import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find contact section - looking for page ID or section header
patterns = [
    r'<div id="page-contact"[^>]*>(.*?)</div>\s*(?=</main>|<!-- COMMON)',
    r'<!-- 9\. CONTACT PAGE -->.*?<div[^>]*>(.*?)(?=</main>|<!-- COMMON)',
]

contact_content = None
for pattern in patterns:
    match = re.search(pattern, content, re.DOTALL)
    if match:
        contact_content = match.group(1)
        print(f"Found contact content using pattern")
        break

if not contact_content:
    print("Trying alternative search...")
    # Find by searching for contact-specific content
    start = content.find('Contact Hero')
    if start > 0:
        # Go back to find the opening div
        search_back = content[:start].rfind('<div')
        if search_back > 0:
            # Find the closing tag
            end = content.find('</main>', start)
            if end < 0:
                end = content.find('<!-- COMMON FOOTER', start)
            contact_content = content[search_back:end]
            print("Found contact content by content search")

if contact_content:
    # Extract header
    header_match = re.search(r'(<!DOCTYPE html>.*?<main class="page-content"[^>]*>)', content, re.DOTALL)
    header = header_match.group(1) if header_match else ''
    
    # Update navigation links in header
    header = header.replace('href="#home1"', 'href="index.html"')
    header = header.replace('href="#home2"', 'href="home2.html"')
    header = header.replace('href="#about"', 'href="about.html"')
    header = header.replace('href="#services"', 'href="services.html"')
    header = header.replace('href="#talent"', 'href="talent.html"')
    header = header.replace('href="#audiobook"', 'href="audiobook.html"')
    header = header.replace('href="#localization"', 'href="localization.html"')
    header = header.replace('href="#contact"', 'href="contact.html"')
    header = re.sub(r' onclick="navigateTo\([^)]+\)"', '', header)
    
    # Extract footer
    footer_match = re.search(r'(</main>.*?</html>)', content, re.DOTALL)
    footer = footer_match.group(1) if footer_match else ''
    
    # Update links in contact content
    contact_content = contact_content.replace('href="#home1"', 'href="index.html"')
    contact_content = contact_content.replace('href="#home2"', 'href="home2.html"')
    contact_content = contact_content.replace('href="#about"', 'href="about.html"')
    contact_content = contact_content.replace('href="#services"', 'href="services.html"')
    contact_content = contact_content.replace('href="#talent"', 'href="talent.html"')
    contact_content = contact_content.replace('href="#audiobook"', 'href="audiobook.html"')
    contact_content = contact_content.replace('href="#localization"', 'href="localization.html"')
    contact_content = contact_content.replace('href="#contact"', 'href="contact.html"')
    contact_content = re.sub(r' onclick="navigateTo\([^)]+\)"', '', contact_content)
    
    # Write contact.html
    with open('contact.html', 'w', encoding='utf-8') as cf:
        cf.write(header + '\n' + contact_content + '\n' + footer)
    
    print('✓ Created contact.html successfully!')
else:
    print('✗ Could not find contact page content')
