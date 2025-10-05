"""
Test script to verify external wiki URLs are generated correctly
"""
import json

# Load the parsed difficulties
with open('difficulties/difficulties.json', 'r', encoding='utf-8') as f:
    difficulties = json.load(f)

# Find difficulties with external wiki links (EToH difficulties)
print("External Wiki Difficulties (EToH):")
print("=" * 80)

external_diffs = [d for d in difficulties if 'jtoh.fandom.com' in d['url']]

if external_diffs:
    for diff in external_diffs[:10]:  # Show first 10
        print(f"Name: {diff['name']}")
        print(f"  URL: {diff['url']}")
        print(f"  Class: {diff['class']}")
        print(f"  Section: {diff['class_section']}")
        print()
    print(f"Total external wiki difficulties: {len(external_diffs)}")
else:
    print("No external wiki difficulties found!")

print("\n" + "=" * 80)
print("\nInternal Wiki Difficulties (JJT):")
print("=" * 80)

internal_diffs = [d for d in difficulties if 'jtohs-joke-towers.fandom.com' in d['url']]
print(f"Total internal wiki difficulties: {len(internal_diffs)}")

# Show a few examples
for diff in internal_diffs[:3]:
    print(f"Name: {diff['name']}")
    print(f"  URL: {diff['url']}")
    print()

# Check for etoh-misc wiki
misc_diffs = [d for d in difficulties if 'etoh-misc.fandom.com' in d['url']]
if misc_diffs:
    print("\n" + "=" * 80)
    print("\nEToH-Misc Wiki Difficulties:")
    print("=" * 80)
    for diff in misc_diffs:
        print(f"Name: {diff['name']}")
        print(f"  URL: {diff['url']}")
        print()
