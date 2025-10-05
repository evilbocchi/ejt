"""
Test the wikitext extraction on a single file
"""
import re
from pathlib import Path

def extract_main_content(wikitext):
    """
    Extract the main content from wikitext, removing wrapper divs,
    templates, and other metadata
    """
    content = wikitext
    
    # Remove leading/trailing wrapper divs
    # Pattern: <div ...> at start, </div> at end
    content = re.sub(r'^<div[^>]*>\s*', '', content, flags=re.MULTILINE)
    content = re.sub(r'\s*</div>\s*$', '', content, flags=re.MULTILINE)
    
    # Remove DISPLAYTITLE and other magic words
    content = re.sub(r'\{\{DISPLAYTITLE:.*?\}\}', '', content)
    content = re.sub(r'__NOEDITSECTION__', '', content)
    content = re.sub(r'__NOTOC__', '', content)
    
    # Remove templates at the start (infoboxes, notices, quotes, tabs)
    # These are usually at the beginning before the first == header ==
    first_header = re.search(r'^==\s*[^=]+\s*==$', content, flags=re.MULTILINE)
    if first_header:
        start_pos = first_header.start()
        # Look for templates before the first header
        before_header = content[:start_pos]
        
        # Remove common templates
        before_header = re.sub(r'\{\{[^}]+\}\}', '', before_header)
        before_header = re.sub(r'\{\{(?:[^{}]|\{[^{]|\}[^}])*\}\}', '', before_header, flags=re.DOTALL)
        
        # Clean up excessive newlines
        before_header = re.sub(r'\n{3,}', '\n\n', before_header)
        before_header = before_header.strip()
        
        # If there's meaningful content left, keep it
        if before_header and len(before_header) > 10:
            content = before_header + '\n\n' + content[start_pos:]
        else:
            content = content[start_pos:]
    
    # Remove HTML divs but keep content inside
    content = re.sub(r'<div[^>]*>', '', content)
    content = re.sub(r'</div>', '', content)
    
    # Remove inline styles from span tags but keep content
    content = re.sub(r'<span[^>]*>', '', content)
    content = re.sub(r'</span>', '', content)
    
    # Remove font tags but keep content
    content = re.sub(r'<font[^>]*>', '', content)
    content = re.sub(r'</font>', '', content)
    
    # Clean up File: references in headers
    content = re.sub(r'\[\[File:[^\]]+\]\]\s*', '', content)
    
    # Remove {{PAGENAME}} and other variables
    content = re.sub(r'\{\{PAGENAME\}\}', '', content)
    
    # Remove remaining simple templates (single line)
    content = re.sub(r'\{\{[^}]+\}\}', '', content)
    
    # Clean up excessive whitespace
    content = re.sub(r'\n{3,}', '\n\n', content)
    content = content.strip()
    
    return content

def main():
    # Test on the 16.wikitext file
    test_file = Path('difficulties/wikitext/16.wikitext')
    
    if not test_file.exists():
        print(f"❌ Test file not found: {test_file}")
        return
    
    print(f"Reading {test_file}...")
    with open(test_file, 'r', encoding='utf-8') as f:
        wikitext = f.read()
    
    print(f"Original size: {len(wikitext)} characters\n")
    print("=" * 80)
    print("ORIGINAL WIKITEXT (first 500 chars)")
    print("=" * 80)
    print(wikitext[:500])
    print("\n...")
    
    # Extract main content
    main_content = extract_main_content(wikitext)
    
    print("\n" + "=" * 80)
    print("EXTRACTED CONTENT")
    print("=" * 80)
    print(f"Extracted size: {len(main_content)} characters\n")
    print(main_content)
    
    # Save to file for inspection
    output_file = Path('difficulties/wikitext/16_extracted.wikitext')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(main_content)
    
    print("\n" + "=" * 80)
    print(f"✅ Saved extracted content to: {output_file}")
    print("=" * 80)

if __name__ == "__main__":
    main()
