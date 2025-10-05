import json

with open('../difficulties.json', encoding='utf-8') as f:
    data = json.load(f)

unclassified = [d for d in data if d.get('class') == 'Unclassified']

print(f"Total Unclassified: {len(unclassified)}\n")
print("Unclassified difficulties:")
for d in unclassified:
    section = d.get('class_section', 'N/A')
    print(f"  - {d['name']} (Section: {section}, Type: {d.get('type')})")
