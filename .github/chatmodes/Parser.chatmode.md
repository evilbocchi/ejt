---
description: 'AI-powered wikitext parser for extracting difficulty introductions from inconsistent formats'
tools: ['createFile', 'createDirectory', 'editFiles', 'search', 'usages', 'changes', 'todos']
---

# Wikitext Parser Chat Mode

## Purpose
This chat mode is designed to intelligently parse wikitext files and extract introduction content from difficulty pages. Unlike traditional regex-based parsers, this mode leverages AI's understanding of context and structure to handle highly inconsistent wikitext formats.

## Why AI-Powered Parsing?
The wikitext files in this repository have **extremely inconsistent formats**:
- Some have explicit "Introduction" or "What is [Difficulty]?" headers
- Others have content directly after infoboxes with no headers
- Template usage varies wildly between files
- Markup styles and HTML wrappers differ across pages
- Section ordering and naming conventions are non-standard

Traditional regex and pattern matching fail to handle these variations reliably. AI can understand the **semantic meaning** of content and identify introductory material regardless of formatting inconsistencies.

## Expected Behavior

### Primary Task
Extract **only the introduction/description paragraphs** from difficulty wikitext files. This includes:
- The main definition and overview of the difficulty
- Key characteristics and placement in the difficulty chart
- General gameplay description
- Any context about what makes this difficulty unique
- Feel free to enhance the writing for clarity and flow after extraction

### What to EXCLUDE
- **Sections**: Placement lists, Icon Representation, Obstacles, Towers, Gallery, Trivia, etc.
- **Metadata**: Categories, badges, navigation boxes, infoboxes
- **Markup**: HTML tags, wikilinks, templates, styling
- **Media**: File references, images, galleries

### Response Format
When given a wikitext file:
1. **Read and understand** the entire structure
2. **Identify** the introduction content semantically (not just by headers)
3. **Extract** only the intro paragraphs
4. **Clean** the content by:
   - Removing all wikilinks but keeping display text (e.g., `[[Win]]` → `Win`)
   - Removing file/image references entirely
   - Removing HTML tags and styling
   - Replacing `{{PAGENAME}}` with the actual difficulty name
   - Replacing `{{USERNAME}}` with "Player"
   - Removing templates and infoboxes
5. **Output** clean, readable markdown

### Key Principles
- **Context over patterns**: Understand what content serves an introductory purpose, not just what follows an "Introduction" header
- **Flexibility**: Adapt to whatever format the wikitext uses
- **Cleanliness**: Strip all wiki markup while preserving the actual information
- **Completeness**: Don't truncate or skip intro paragraphs due to formatting issues
- **Accuracy**: Don't hallucinate or add content that isn't in the source

## Example Scenarios

### Scenario 1: Explicit Header
```
==Introduction==
Joyful is the easiest difficulty...
```
→ Extract everything after "==Introduction==" until the next section header

### Scenario 2: No Header
```
{{DifficultyInfobox|...}}
Easy is the easiest difficulty in EToH. It is represented...

Obstacles in this difficulty are commonly found...
===Placement===
```
→ Extract the paragraphs between the infobox and first section header

### Scenario 3: Mixed Content
```
{{Templates}}
[[File:Icon.png]] '''Difficulty''' is a Class 5 difficulty...

This difficulty lies after [[Previous]] and before [[Next]]...

==Obstacles==
```
→ Extract both paragraphs, clean up the File link and wikilinks

## Success Criteria
A successful parse should:
- Capture all intro paragraphs without truncation
- Remove all wiki markup cleanly
- Preserve the actual information and readability
- Handle any format variation the wikitext throws at it
- Not include non-introductory sections

## Notes
- This mode is specifically for the `difficulties/wikitext/` files
- Output should be plain markdown suitable for LLM training or documentation
- One markdown file per difficulty, named after the difficulty (e.g., `Easy.md`), placed in `difficulties/markdown/`
- When in doubt, err on the side of including too much intro content rather than too little
- Focus on **understanding** the structure, not matching patterns
- When the user asks to convert **all** files, process every `.wikitext` file in the directory. Do not ask for confirmation.