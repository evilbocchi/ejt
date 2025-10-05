import re
import json
from typing import List, Dict, Optional

def parse_wikitext_difficulties(wikitext_file: str) -> List[Dict]:
    """
    Parse wikitext file to extract difficulties with their ratings, classes, and URLs.
    
    Returns a list of dictionaries with keys:
    - name: difficulty name
    - rating: difficulty rating
    - type: difficulty type (Normal, Sub-Difficulty, etc.)
    - class: class name (e.g., "Class Negative", "Class 0", etc.)
    - class_section: section within class (Baseline, Low, Mid, High, Peak, etc.)
    - image: image filename
    - url: wiki URL (constructed from name)
    """
    
    with open(wikitext_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    difficulties = []
    current_class = None
    current_class_section = None
    in_table = False
    
    lines = content.split('\n')
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Detect class headers (with or without <nowiki> tags)
        class_match = re.search(r'\|(?:<nowiki>)?Class (Negative|\d+|[A-Z][a-z]+) \| (.+?)(?:</nowiki>)?(?:\||\n|$)', line)
        if class_match:
            current_class = f"Class {class_match.group(1)}"
            in_table = False
        
        # Detect table start for difficulties
        if 'wikitable mw-collapsible' in line and current_class:
            in_table = True
        
        # Detect class sections (Baseline, Low, Mid, High, Peak, Skyline)
        if in_table and ('background:' in line or 'style="background:' in line):
            section_match = re.search(r"'''(Baseline|Low|Mid|High|Peak|Skyline|Chains)(?:\s*\([^)]*\))?'''", line)
            if section_match:
                current_class_section = section_match.group(1)
                i += 1
                continue
        
        # Parse difficulty rows
        if in_table and line.startswith('|') and not line.startswith('|-') and not line.startswith('|colspan') and not line.startswith('!'):
            # Check if this is a difficulty entry (has File: pattern)
            if 'File:' in line or '{{Class' in line:
                # Try to extract difficulty info across multiple lines
                difficulty_lines = [line]
                
                # Collect the next 3 lines (image, name, type, rating)
                for j in range(1, 4):
                    if i + j < len(lines):
                        difficulty_lines.append(lines[i + j].strip())
                
                # Parse image
                image_match = re.search(r'File:([^|\]]+)', difficulty_lines[0])
                image = None
                if image_match:
                    image = image_match.group(1)
                else:
                    # Try template pattern like {{Class0Difficulties|Win|50px}}
                    template_match = re.search(r'{{[^|]+\|([^|]+)\|', difficulty_lines[0])
                    if template_match:
                        image = f"{template_match.group(1)}.png"
                
                if image:
                    
                    # Parse name (next line)
                    name_line = difficulty_lines[1] if len(difficulty_lines) > 1 else ""
                    
                    # Extract name from wiki link [[Name]] or [[w:c:jtoh:Name|Display]]
                    # Check for external wiki first
                    external_wiki_match = re.search(r'\[\[w:c:([^:]+):([^\]|]+)(?:\|([^\]]+))?\]\]', name_line)
                    
                    if external_wiki_match:
                        # External wiki link
                        wiki_subdomain = external_wiki_match.group(1)
                        wiki_page = external_wiki_match.group(2)
                        display_name = external_wiki_match.group(3) if external_wiki_match.group(3) else wiki_page
                        wiki_name = wiki_page
                        wiki_url = f"https://{wiki_subdomain}.fandom.com/wiki/{wiki_page.replace(' ', '_')}"
                    else:
                        # Internal wiki link
                        name_match = re.search(r'\[\[(?:File:[^\]]+\|)?([^\]|]+)(?:\|([^\]]+))?\]\]', name_line)
                        if not name_match:
                            i += 1
                            continue
                        
                        display_name = name_match.group(2) if name_match.group(2) else name_match.group(1)
                        wiki_name = name_match.group(1)
                        wiki_url = f"https://jtohs-joke-towers.fandom.com/wiki/{wiki_name.replace(' ', '_')}"
                    
                    # Remove HTML tags and markdown
                    display_name = re.sub(r'<[^>]+>', '', display_name)
                    display_name = re.sub(r"'''|''", '', display_name)
                    display_name = re.sub(r'<big>|</big>', '', display_name)
                    display_name = display_name.strip()
                    
                    # Parse type (2 lines down)
                    type_line = difficulty_lines[2] if len(difficulty_lines) > 2 else ""
                    difficulty_type = type_line.lstrip('|').strip()
                    difficulty_type = re.sub(r"'''|''|<big>|</big>", '', difficulty_type)
                    
                    # Parse rating (3 lines down)
                    rating_line = difficulty_lines[3] if len(difficulty_lines) > 3 else ""
                    rating = rating_line.lstrip('|').strip()
                    rating = re.sub(r'<[^>]+>', '', rating)
                    rating = re.sub(r"'''|''", '', rating)
                    
                    # Skip header rows and section markers
                    if difficulty_type not in ['Difficulty Type', 'EJT', 'EToH'] and display_name and current_class_section != 'Chains':
                        difficulty = {
                            'name': display_name,
                            'wiki_name': wiki_name,
                            'rating': rating,
                            'type': difficulty_type,
                            'class': current_class,
                            'class_section': current_class_section,
                            'image': image,
                            'url': wiki_url
                        }
                        difficulties.append(difficulty)
                        
                        # Skip the lines we just processed
                        i += 3
        
        i += 1
    
    return difficulties


def parse_unclassified_difficulties(wikitext_file: str) -> List[Dict]:
    """
    Parse unclassified difficulties from the wikitext.
    """
    with open(wikitext_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    difficulties = []
    in_unclassified = False
    in_table = False
    current_section = None
    
    lines = content.split('\n')
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Detect unclassified section
        if 'Unclassified Difficulties' in line and '|width' in line:
            in_unclassified = True
        
        if in_unclassified and 'wikitable' in line:
            in_table = True
        
        # End of unclassified section - stop when we hit Navigation or Class sections
        if in_unclassified and ('Navigation between Charts' in line or 
                                re.search(r'Class (Negative|\d+|[A-Z][a-z]+) \|', line)):
            break
        
        # Detect subsections
        if in_table and 'background:#' in line and "'''" in line:
            section_match = re.search(r"'''([^']+)'''", line)
            if section_match:
                current_section = section_match.group(1)
        
        # Parse difficulty rows
        if in_table and line.startswith('|[[File:'):
            difficulty_lines = [line]
            for j in range(1, 4):
                if i + j < len(lines):
                    difficulty_lines.append(lines[i + j].strip())
            
            # Parse image
            image_match = re.search(r'File:([^|\]]+)', difficulty_lines[0])
            if image_match:
                image = image_match.group(1)
                
                # Parse name
                name_line = difficulty_lines[1] if len(difficulty_lines) > 1 else ""
                
                # Check for external wiki first
                external_wiki_match = re.search(r'\[\[w:c:([^:]+):([^\]|]+)(?:\|([^\]]+))?\]\]', name_line)
                
                if external_wiki_match:
                    # External wiki link
                    wiki_subdomain = external_wiki_match.group(1)
                    wiki_page = external_wiki_match.group(2)
                    display_name = external_wiki_match.group(3) if external_wiki_match.group(3) else wiki_page
                    wiki_name = wiki_page
                    wiki_url = f"https://{wiki_subdomain}.fandom.com/wiki/{wiki_page.replace(' ', '_')}"
                else:
                    # Internal wiki link
                    name_match = re.search(r'\[\[([^\]|]+)(?:\|([^\]]+))?\]\]', name_line)
                    if not name_match:
                        i += 1
                        continue
                    
                    display_name = name_match.group(2) if name_match.group(2) else name_match.group(1)
                    wiki_name = name_match.group(1)
                    wiki_url = f"https://jtohs-joke-towers.fandom.com/wiki/{wiki_name.replace(' ', '_')}"
                
                # Remove HTML tags and markdown
                display_name = re.sub(r'<[^>]+>', '', display_name)
                display_name = re.sub(r"'''|''", '', display_name)
                display_name = display_name.strip()
                
                # Parse type
                type_line = difficulty_lines[2] if len(difficulty_lines) > 2 else ""
                difficulty_type = type_line.lstrip('|').strip()
                
                # Parse rating
                rating_line = difficulty_lines[3] if len(difficulty_lines) > 3 else ""
                rating = rating_line.lstrip('|').strip()
                
                if display_name and difficulty_type not in ['Difficulty Type']:
                    difficulty = {
                        'name': display_name,
                        'wiki_name': wiki_name,
                        'rating': rating,
                        'type': difficulty_type,
                        'class': 'Unclassified',
                        'class_section': current_section,
                        'image': image,
                        'url': wiki_url
                    }
                    difficulties.append(difficulty)
                    i += 3
        
        i += 1
    
    return difficulties


if __name__ == "__main__":
    # Parse the wikitext file
    difficulties = parse_wikitext_difficulties('difficulties/source.wikitext')
    unclassified = parse_unclassified_difficulties('difficulties/source.wikitext')

    # Combine both lists
    all_difficulties = unclassified + difficulties
    
    # Save to JSON
    with open('difficulties.json', 'w', encoding='utf-8') as f:
        json.dump(all_difficulties, f, indent=2, ensure_ascii=False)
    
    print(f"Parsed {len(all_difficulties)} difficulties ({len(unclassified)} unclassified + {len(difficulties)} classified)")
    print(f"Saved to difficulties.json")
    
    # Print some examples
    print("\nExample difficulties:")
    for diff in all_difficulties[:5]:
        print(f"  - {diff['name']} ({diff['class']}, {diff['rating']})")
