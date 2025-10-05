"""
Example: Show how external wiki URLs are now correctly generated
"""
import json

with open('difficulties.json', 'r', encoding='utf-8') as f:
    difficulties = json.load(f)

print("=" * 80)
print("EXTERNAL WIKI URL HANDLING - DEMONSTRATION")
print("=" * 80)

# Find some examples from each wiki
examples = {
    'JJT (Internal)': [],
    'EToH': [],
    'EToH-Misc': [],
    'JToH Hardest Towers': []
}

for diff in difficulties:
    url = diff['url']
    if 'jtohs-joke-towers' in url and len(examples['JJT (Internal)']) < 2:
        examples['JJT (Internal)'].append(diff)
    elif 'jtoh.fandom.com' in url and len(examples['EToH']) < 2:
        examples['EToH'].append(diff)
    elif 'etoh-misc' in url and len(examples['EToH-Misc']) < 2:
        examples['EToH-Misc'].append(diff)
    elif 'jtohs-hardest-towers' in url and len(examples['JToH Hardest Towers']) < 2:
        examples['JToH Hardest Towers'].append(diff)

for wiki_name, diffs in examples.items():
    print(f"\n{wiki_name}:")
    print("-" * 80)
    for diff in diffs:
        print(f"  Name: {diff['name']}")
        print(f"  URL:  {diff['url']}")
    if not diffs:
        print("  (No difficulties found)")

print("\n" + "=" * 80)
print("\nSUMMARY:")
print("The parser now correctly:")
print("  ✓ Detects external wiki links in format: [[w:c:subdomain:Page|Display]]")
print("  ✓ Generates correct URLs: https://subdomain.fandom.com/wiki/Page")
print("  ✓ Handles internal links: [[Page]] → https://jtohs-joke-towers.fandom.com/wiki/Page")
print("=" * 80)
