"""
Download wikitext content for all difficulties from their wiki pages
"""
import json
import os
import requests
import time
from urllib.parse import urlparse, unquote

def get_api_url_from_wiki_url(wiki_url):
    """
    Convert a wiki page URL to the API endpoint URL
    Example: https://jtoh.fandom.com/wiki/Easy -> https://jtoh.fandom.com/api.php
    """
    parsed = urlparse(wiki_url)
    base_url = f"{parsed.scheme}://{parsed.netloc}"
    
    # Extract page title from URL (after /wiki/)
    page_title = parsed.path.replace('/wiki/', '')
    page_title = unquote(page_title)  # Decode URL encoding
    
    # Construct API URL
    api_url = f"{base_url}/api.php?action=query&prop=revisions&titles={page_title}&rvslots=main&rvprop=content&formatversion=2&format=json"
    
    return api_url, page_title

def download_wikitext(api_url, page_title):
    """
    Download wikitext content from the Fandom API
    Returns the wikitext content or None if failed
    """
    try:
        response = requests.get(api_url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Navigate through the JSON structure
        pages = data.get('query', {}).get('pages', [])
        if not pages:
            print(f"  ❌ No pages found for {page_title}")
            return None
        
        page = pages[0]
        
        # Check if page exists
        if 'missing' in page:
            print(f"  ❌ Page does not exist: {page_title}")
            return None
        
        # Get the wikitext content
        revisions = page.get('revisions', [])
        if not revisions:
            print(f"  ❌ No revisions found for {page_title}")
            return None
        
        wikitext = revisions[0].get('slots', {}).get('main', {}).get('content')
        
        if wikitext:
            return wikitext
        else:
            print(f"  ❌ No content found for {page_title}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Request failed for {page_title}: {e}")
        return None
    except (KeyError, IndexError, json.JSONDecodeError) as e:
        print(f"  ❌ Failed to parse response for {page_title}: {e}")
        return None

def sanitize_filename(name):
    """
    Sanitize filename by removing/replacing invalid characters
    """
    # Replace invalid filename characters
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        name = name.replace(char, '_')
    
    # Remove leading/trailing spaces and dots
    name = name.strip('. ')
    
    # Limit length
    if len(name) > 200:
        name = name[:200]
    
    return name

def main():
    import sys
    # Check for optional argument
    specific_name = None
    if len(sys.argv) > 1:
        specific_name = sys.argv[1].strip()
        print(f"Filtering for difficulty name: {specific_name}\n")

    # Load difficulties
    print("Loading difficulties.json...")
    with open('difficulties.json', 'r', encoding='utf-8') as f:
        difficulties = json.load(f)

    if specific_name:
        filtered = [d for d in difficulties if d['name'].lower() == specific_name.lower()]
        if not filtered:
            print(f"No difficulty found with name: {specific_name}")
            return
        difficulties = filtered

    print(f"Found {len(difficulties)} difficulties\n")

    # Create output directory
    output_dir = 'difficulties/wikitext'
    os.makedirs(output_dir, exist_ok=True)
    print(f"Output directory: {output_dir}\n")

    # Track statistics
    stats = {
        'success': 0,
        'failed': 0,
        'skipped': 0,
        'by_wiki': {}
    }

    # Process each difficulty
    for i, difficulty in enumerate(difficulties, 1):
        name = difficulty['name']
        url = difficulty['url']

        # Extract wiki domain for statistics
        wiki_domain = urlparse(url).netloc
        if wiki_domain not in stats['by_wiki']:
            stats['by_wiki'][wiki_domain] = {'success': 0, 'failed': 0}

        # Create safe filename
        safe_name = sanitize_filename(name)
        output_file = os.path.join(output_dir, f"{safe_name}.wikitext")

        # Skip if already downloaded
        if os.path.exists(output_file):
            print(f"[{i}/{len(difficulties)}] ⏭️  Skipping {name} (already exists)")
            stats['skipped'] += 1
            continue

        print(f"[{i}/{len(difficulties)}] 📥 Downloading {name}...")
        print(f"  URL: {url}")

        # Get API URL
        api_url, page_title = get_api_url_from_wiki_url(url)

        # Download wikitext
        wikitext = download_wikitext(api_url, page_title)

        if wikitext:
            # Save to file
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(wikitext)

            print(f"  ✅ Saved to {output_file}")
            print(f"  📊 Size: {len(wikitext)} characters")
            stats['success'] += 1
            stats['by_wiki'][wiki_domain]['success'] += 1
        else:
            print(f"  ❌ Failed to download")
            stats['failed'] += 1
            stats['by_wiki'][wiki_domain]['failed'] += 1

        print()

        # Be nice to the API - rate limiting
        time.sleep(0.5)  # Wait 500ms between requests

    # Print summary
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total difficulties: {len(difficulties)}")
    print(f"  ✅ Successfully downloaded: {stats['success']}")
    print(f"  ⏭️  Skipped (already exist): {stats['skipped']}")
    print(f"  ❌ Failed: {stats['failed']}")
    print()
    print("By wiki:")
    for wiki, counts in stats['by_wiki'].items():
        print(f"  {wiki}:")
        print(f"    Success: {counts['success']}")
        print(f"    Failed: {counts['failed']}")
    print("=" * 80)

if __name__ == "__main__":
    main()
