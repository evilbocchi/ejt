import json

with open('difficulties/difficulties.json', encoding='utf-8') as f:
    data = json.load(f)

# Count by class
class_counts = {}
for d in data:
    cls = d.get('class', 'Unknown')
    class_counts[cls] = class_counts.get(cls, 0) + 1

print("Difficulties by class:")
for cls in sorted(class_counts.keys()):
    print(f"  {cls}: {class_counts[cls]}")

print(f"\nTotal: {len(data)} difficulties")
