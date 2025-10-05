# JJT Difficulties Scraper

This directory contains scripts for scraping, parsing, and converting difficulty data from the JToH wiki.

## Scripts

### 1. `parse_main.py`
Parses the main difficulty chart wikitext to extract difficulty information.

**Usage:**
```bash
python scraper/parse_main.py
```

**Output:** `difficulties.json` containing all difficulties with their metadata (name, rating, class, etc.)

---

### 2. `download_difficulty_wikitext.py`
Downloads the full wikitext content for each difficulty from the wiki.

**Prerequisites:**
- `difficulties.json` must exist (run `parse_main.py` first)

**Usage:**
```bash
python scraper/download_difficulty_wikitext.py
```

**Output:** Individual `.wikitext` files in `difficulties/wikitext/` directory

---

### 3. `convert_wikitext_to_markdown.py`
Converts wikitext files to clean markdown format.

**Prerequisites:**
- Install **pandoc**: https://pandoc.org/installing.html
  - Windows: `winget install pandoc` or download from [releases](https://github.com/jgm/pandoc/releases)
  - After installation, **restart your terminal**
- Wikitext files must exist (run `download_difficulty_wikitext.py` first)

**Usage:**
```bash
python scraper/convert_wikitext_to_markdown.py
```

**Output:** Markdown files in `difficulties/markdown/` directory

**What it does:**
- Removes HTML wrapper divs, templates, and metadata
- Strips out infoboxes, notices, and styling
- Extracts the main content (headers and body text)
- Converts MediaWiki syntax to Markdown using pandoc

---

### 4. `test_extraction.py`
Tests the wikitext extraction on a single file (`16.wikitext`).

**Usage:**
```bash
python scraper/test_extraction.py
```

**Output:** 
- Console output showing before/after extraction
- `difficulties/wikitext/16_extracted.wikitext` for inspection

---

## Workflow

To scrape and convert all difficulties:

```bash
# Step 1: Parse the main chart
python scraper/parse_main.py

# Step 2: Download individual difficulty wikitexts
python scraper/download_difficulty_wikitext.py

# Step 3: Install pandoc (if not already installed)
# Windows: winget install pandoc
# Then restart terminal

# Step 4: Convert to markdown
python scraper/convert_wikitext_to_markdown.py
```

## Output Structure

```
difficulties/
├── wikitext/       # Raw wikitext from wiki
│   ├── Easy.wikitext
│   ├── 16.wikitext
│   └── ...
└── markdown/       # Converted markdown
    ├── Easy.md
    ├── 16.md
    └── ...
```

## Notes

- The scripts handle rate limiting when downloading from the wiki (500ms delay between requests)
- Files that already exist are skipped to avoid re-downloading
- External wiki links (e.g., to JToH wiki) are properly handled
- The extraction process removes most wiki templates and formatting while preserving content
