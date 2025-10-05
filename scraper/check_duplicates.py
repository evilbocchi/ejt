import json

with open('../difficulties.json', encoding='utf-8') as f:
    data = json.load(f)

# Check for duplicate names
name_counts = {}
for d in data:
    name = d['name']
    if name not in name_counts:
        name_counts[name] = []
    name_counts[name].append(d)

# Find duplicates
duplicates = {name: entries for name, entries in name_counts.items() if len(entries) > 1}

print(f"Total difficulties: {len(data)}")
print(f"Unique names: {len(name_counts)}")
print(f"Duplicated names: {len(duplicates)}")

if duplicates:
    print("\nFirst 10 duplicates:")
    for i, (name, entries) in enumerate(list(duplicates.items())[:10]):
        print(f"\n{i+1}. '{name}' appears {len(entries)} times:")
        for entry in entries:
            print(f"   - Class: {entry.get('class')}, Section: {entry.get('class_section')}, Rating: {entry.get('rating')}")
