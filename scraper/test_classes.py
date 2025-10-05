import json

with open('difficulties/difficulties.json', encoding='utf-8') as f:
    data = json.load(f)

class2 = [d for d in data if d.get('class') == 'Class 2']
class3 = [d for d in data if d.get('class') == 'Class 3']

print(f'Class 2: {len(class2)} difficulties')
print(f'Class 3: {len(class3)} difficulties')

print('\nFirst 5 Class 2:')
for d in class2[:5]:
    print(f"  - {d['name']} ({d['rating']}) - Section: {d.get('class_section')}")

print('\nFirst 5 Class 3:')
for d in class3[:5]:
    print(f"  - {d['name']} ({d['rating']}) - Section: {d.get('class_section')}")
