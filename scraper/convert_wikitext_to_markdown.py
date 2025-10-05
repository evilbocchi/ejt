"""
Convert difficulty wikitext files to markdown
Extracts main content and uses pandoc for conversion

PREREQUISITES:
1. Install pandoc: https://pandoc.org/installing.html
   - Windows: Download and run the installer from https://github.com/jgm/pandoc/releases
   - Or use: winget install pandoc
   - Or use Chocolatey: choco install pandoc
   
2. After installation, restart your terminal

USAGE:
    python scraper/convert_wikitext_to_markdown.py
"""
import os
import re
import subprocess
import json
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

def convert_wikitext_to_markdown(wikitext, output_file):
    """
    Convert wikitext to markdown using pandoc
    Returns True if successful, False otherwise
    """
    try:
        # Run pandoc to convert from mediawiki to markdown
        result = subprocess.run(
            ['pandoc', '-f', 'mediawiki', '-t', 'markdown', '-o', output_file],
            input=wikitext,
            text=True,
            capture_output=True,
            timeout=30
        )
        
        if result.returncode == 0:
            return True
        else:
            print(f"  ❌ Pandoc error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"  ❌ Pandoc timeout")
        return False
    except FileNotFoundError:
        print(f"  ❌ Pandoc not found. Please install pandoc: https://pandoc.org/installing.html")
        return False
    except Exception as e:
        print(f"  ❌ Conversion error: {e}")
        return False

def sanitize_filename(name):
    """
    Sanitize filename by removing/replacing invalid characters
    """
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        name = name.replace(char, '_')
    name = name.strip('. ')
    if len(name) > 200:
        name = name[:200]
    return name

def main():
    # Directories
    wikitext_dir = Path('difficulties/wikitext')
    markdown_dir = Path('difficulties/markdown')
    
    # Create output directory
    markdown_dir.mkdir(parents=True, exist_ok=True)
    print(f"Output directory: {markdown_dir}\n")
    
    # Check if pandoc is available
    try:
        result = subprocess.run(['pandoc', '--version'], capture_output=True, timeout=5)
        if result.returncode != 0:
            print("❌ Pandoc is not available. Please install it first.")
            print("   Visit: https://pandoc.org/installing.html")
            return
        print("✅ Pandoc is available\n")
    except (FileNotFoundError, subprocess.TimeoutExpired):
        print("❌ Pandoc is not available. Please install it first.")
        print("   Visit: https://pandoc.org/installing.html")
        return
    
    # Get all wikitext files
    wikitext_files = list(wikitext_dir.glob('*.wikitext'))
    print(f"Found {len(wikitext_files)} wikitext files\n")
    
    # Track statistics
    stats = {
        'success': 0,
        'failed': 0,
        'skipped': 0
    }
    
    # Process each file
    for i, wikitext_file in enumerate(wikitext_files, 1):
        name = wikitext_file.stem
        output_file = markdown_dir / f"{name}.md"
        
        # Skip if already converted
        if output_file.exists():
            print(f"[{i}/{len(wikitext_files)}] ⏭️  Skipping {name} (already exists)")
            stats['skipped'] += 1
            continue
        
        print(f"[{i}/{len(wikitext_files)}] 🔄 Converting {name}...")
        
        try:
            # Read wikitext
            with open(wikitext_file, 'r', encoding='utf-8') as f:
                wikitext = f.read()
            
            # Extract main content
            main_content = extract_main_content(wikitext)
            
            if not main_content or len(main_content) < 10:
                print(f"  ⚠️  No meaningful content extracted")
                stats['failed'] += 1
                continue
            
            print(f"  📝 Extracted {len(main_content)} characters")
            
            # Convert to markdown using pandoc
            if convert_wikitext_to_markdown(main_content, str(output_file)):
                # Read the converted file to check size
                with open(output_file, 'r', encoding='utf-8') as f:
                    markdown_content = f.read()
                
                print(f"  ✅ Converted to {output_file}")
                print(f"  📊 Markdown size: {len(markdown_content)} characters")
                stats['success'] += 1
            else:
                stats['failed'] += 1
                
        except Exception as e:
            print(f"  ❌ Error: {e}")
            stats['failed'] += 1
        
        print()
    
    # Print summary
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total files: {len(wikitext_files)}")
    print(f"  ✅ Successfully converted: {stats['success']}")
    print(f"  ⏭️  Skipped (already exist): {stats['skipped']}")
    print(f"  ❌ Failed: {stats['failed']}")
    print("=" * 80)

if __name__ == "__main__":
    main()
