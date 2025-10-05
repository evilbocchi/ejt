"""
Check if there are any EToH difficulties in the classified sections
"""
import json

with open('difficulties.json', 'r', encoding='utf-8') as f:
    difficulties = json.load(f)

# Find classified EToH difficulties
classified_etoh = [
    d for d in difficulties 
    if d['class'] != 'Unclassified' and 'jtoh.fandom.com' in d['url']
]

if classified_etoh:
    print(f"Found {len(classified_etoh)} EToH difficulties in classified sections:")
    print("=" * 80)
    for diff in classified_etoh:
        print(f"Name: {diff['name']}")
        print(f"  Class: {diff['class']} - {diff['class_section']}")
        print(f"  URL: {diff['url']}")
        print()
else:
    print("No EToH difficulties found in classified sections.")
    print("This is expected - EToH difficulties are typically in the unclassified section.")

# Show summary
print("\n" + "=" * 80)
print("Summary:")
print("=" * 80)

url_domains = {}
for diff in difficulties:
    # Extract domain from URL
    if 'fandom.com' in diff['url']:
        domain = diff['url'].split('//')[1].split('/')[0]
        url_domains[domain] = url_domains.get(domain, 0) + 1

for domain, count in sorted(url_domains.items()):
    print(f"{domain}: {count} difficulties")
