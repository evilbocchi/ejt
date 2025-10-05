"""
Convert difficulty wikitext files to markdown
Extracts main content and uses pandoc for conversion

Usage:
    python convert_wikitext_to_markdown.py              # Convert all files
    python convert_wikitext_to_markdown.py "filename"   # Convert specific file
"""
import re
import subprocess
import sys
from pathlib import Path

def extract_main_content(wikitext, difficulty_name=None):
    """
    Extract only the introduction section from wikitext.
    This includes content from "Introduction", "What is", or similar intro headers
    up until the next major section.
    
    Args:
        wikitext: The wikitext content to extract from
        difficulty_name: The name of the difficulty (from filename) to replace {{PAGENAME}}
    """
    content = wikitext
    
    # Remove leading/trailing wrapper divs
    content = re.sub(r'^<div[^>]*>\s*', '', content, flags=re.MULTILINE)
    content = re.sub(r'\s*</div>\s*$', '', content, flags=re.MULTILINE)
    
    # Remove DISPLAYTITLE and other magic words
    content = re.sub(r'\{\{DISPLAYTITLE:.*?\}\}', '', content)
    content = re.sub(r'__NOEDITSECTION__', '', content)
    content = re.sub(r'__NOTOC__', '', content)
    
    # Replace {{PAGENAME}} with the actual difficulty name BEFORE processing wikilinks
    if difficulty_name:
        content = re.sub(r'\{\{PAGENAME\}\}', difficulty_name, content, flags=re.IGNORECASE)
    
    # Replace other common MediaWiki variables/templates
    content = re.sub(r'\{\{USERNAME\}\}', 'Player', content, flags=re.IGNORECASE)
    content = re.sub(r'\{\{CURRENTUSER\}\}', 'Player', content, flags=re.IGNORECASE)
    
    # Find the introduction section
    # Look for headers like "==Introduction==", "==What is==", or similar
    intro_pattern = r'^==\s*(?:Introduction|What\s+is).*?==\s*$'
    intro_match = re.search(intro_pattern, content, flags=re.MULTILINE | re.IGNORECASE)
    
    if intro_match:
        # Found an explicit introduction header
        # Start from after the introduction header (skip the header itself)
        intro_start = intro_match.end()
        
        # Find the next section header (any level: ==, ===, etc.)
        next_section_pattern = r'^={2,}.+?={2,}$'
        rest_of_content = content[intro_match.end():]
        next_section_match = re.search(next_section_pattern, rest_of_content, flags=re.MULTILINE)
        
        if next_section_match:
            # Extract only up to the next section (not including it)
            intro_end = intro_match.end() + next_section_match.start()
            content = content[intro_start:intro_end]
        else:
            # No next section, take everything from intro onwards
            content = content[intro_start:]
    else:
        # No explicit introduction header found
        # Look for the first paragraph of actual content after templates/infoboxes
        # Find the first section header (any level: ==, ===, etc.)
        first_header = re.search(r'^={2,}.+?={2,}$', content, flags=re.MULTILINE)
        
        if first_header:
            # Extract content before the first header
            # This is likely the introduction paragraph(s)
            content = content[:first_header.start()]
            # Debug
            # print(f"  🐛 After section extraction: {len(content)} chars, starts with: {content[:80]}")
        # else: keep all content if no headers found
    
    # Remove templates and infoboxes (do this early to clean up content)
    # Remove multi-line templates with nested content
    content = re.sub(r'\{\{(?:[^{}]|\{[^{]|\}[^}])*\}\}', ' ', content, flags=re.DOTALL)
    # Remove any remaining simple templates  
    content = re.sub(r'\{\{[^}]+\}\}', ' ', content)
    # Debug
    # print(f"  🐛 After templates: {content[:100]}")
    
    # Remove HTML divs but keep content inside
    # content = re.sub(r'<div[^>]*>', '', content)
    # content = re.sub(r'</div>', '', content)
    
    # Remove tabber tags and content
    content = re.sub(r'<tabber>.*?</tabber>', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'<tabber>.*', '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove gallery tags and content
    content = re.sub(r'<gallery>.*?</gallery>', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'<gallery>.*', '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove category tags (e.g., [[Category:Easy]])
    content = re.sub(r'\[\[Category:[^\]]+\]\]', '', content, flags=re.IGNORECASE)
    
    # Remove HTML comments
    content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
    content = re.sub(r'<!\-\-.*', '', content, flags=re.DOTALL)
    
    # Remove badge links and references
    content = re.sub(r'https?://www\.roblox\.com/badges/[^\s\]]+', '', content)
    
    # NOTE: File reference patterns removed - they were too greedy and eating wikilinks
    # We handle [[File:...]] properly below anyway
    
    # Clean up File: references (do this AFTER extracting sections)
    # Match [[File:...]] properly by looking for content until ]] (not just ])
    content = re.sub(r'\[\[File:.*?\]\]\s*', '', content, flags=re.DOTALL)
    
    # Remove inline styles from span tags but keep content inside
    content = re.sub(r'<span[^>]*>', '', content)
    content = re.sub(r'</span>', '', content)
    
    # Remove font tags but keep content
    content = re.sub(r'<font[^>]*>', '', content)
    content = re.sub(r'</font>', '', content)
    
    # Remove wikilinks but keep the display text
    # Pattern: [[Link|Display Text]] -> Display Text
    # Pattern: [[Link]] -> Link
    # Special handling: remove File/Image links entirely
    content = re.sub(r'\[\[(?:File|Image):[^\]]+\]\]', '', content, flags=re.IGNORECASE)
    content = re.sub(r'\[\[(?:[^|\]]+\|)?([^\]]+)\]\]', r'\1', content)
    
    # Remove external links [http://example.com text] -> text
    content = re.sub(r'\[https?://[^\s\]]+\s+([^\]]+)\]', r'\1', content)
    # Remove bare external links [http://example.com]
    content = re.sub(r'\[https?://[^\s\]]+\]', '', content)
    
    # Remove stray template closing brackets
    content = re.sub(r'^\s*\}\}\s*$', '', content, flags=re.MULTILINE)
    
    # Remove horizontal rules (----)
    content = re.sub(r'^\s*-{3,}\s*$', '', content, flags=re.MULTILINE)
    
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
        # Use bytes input/output to avoid encoding issues on Windows
        # Additional options for cleaner markdown:
        # --wrap=none: Don't wrap lines
        # --markdown-headings=atx: Use # style headers
        result = subprocess.run(
            [
                'pandoc', 
                '-f', 'mediawiki', 
                '-t', 'markdown',
                '--wrap=none',
                '--markdown-headings=atx',
                '-o', str(output_file)
            ],
            input=wikitext.encode('utf-8'),
            capture_output=True,
            timeout=30
        )
        
        if result.returncode == 0:
            # Post-process the markdown to clean up Pandoc artifacts
            with open(output_file, 'r', encoding='utf-8') as f:
                markdown_content = f.read()
            
            # Remove Pandoc's {=html} markers
            markdown_content = re.sub(r'`<([^>]+)>`\{=html\}', '', markdown_content)
            markdown_content = re.sub(r'\{=html\}', '', markdown_content)
            
            # Write back the cleaned content
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(markdown_content)
            
            return True
        else:
            # Decode error message if available
            error_msg = result.stderr.decode('utf-8', errors='replace') if result.stderr else 'Unknown error'
            print(f"  ❌ Pandoc error: {error_msg}")
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
            print("   Windows: winget install pandoc")
            return
        print("✅ Pandoc is available\n")
    except (FileNotFoundError, subprocess.TimeoutExpired):
        print("❌ Pandoc is not available. Please install it first.")
        print("   Visit: https://pandoc.org/installing.html")
        print("   Windows: winget install pandoc")
        return
    
    # Check if a specific file was requested
    if len(sys.argv) > 1:
        # Convert specific file
        filename = sys.argv[1]
        # Add .wikitext extension if not present
        if not filename.endswith('.wikitext'):
            filename = f"{filename}.wikitext"
        
        wikitext_file = wikitext_dir / filename
        if not wikitext_file.exists():
            print(f"❌ File not found: {wikitext_file}")
            print(f"   Looking in: {wikitext_dir.absolute()}")
            return
        
        wikitext_files = [wikitext_file]
        print(f"Converting specific file: {filename}\n")
    else:
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
        
        # Skip if already converted (unless converting a specific file)
        if output_file.exists() and len(sys.argv) == 1:
            print(f"[{i}/{len(wikitext_files)}] ⏭️  Skipping {name} (already exists)")
            stats['skipped'] += 1
            continue
        elif output_file.exists():
            print(f"[{i}/{len(wikitext_files)}] 🔄 Overwriting {name}...")
        
        print(f"[{i}/{len(wikitext_files)}] 🔄 Converting {name}...")
        
        try:
            # Read wikitext
            with open(wikitext_file, 'r', encoding='utf-8') as f:
                wikitext = f.read()
            
            # Extract main content (pass the difficulty name from filename)
            main_content = extract_main_content(wikitext, difficulty_name=name)
            
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
                
                print(f"  ✅ Converted to {output_file.name}")
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
