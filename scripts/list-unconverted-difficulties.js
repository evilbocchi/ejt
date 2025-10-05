const fs = require('fs');
const path = require('path');

const wikitextDir = path.join(__dirname, '../difficulties/wikitext');
const markdownDir = path.join(__dirname, '../difficulties/markdown');

// Get all wikitext filenames (without extension)
const wikitextFiles = fs.readdirSync(wikitextDir)
  .filter(f => f.endsWith('.wikitext'))
  .map(f => path.parse(f).name);

// Get all markdown filenames (without extension)
const markdownFiles = fs.readdirSync(markdownDir)
  .filter(f => f.endsWith('.md'))
  .map(f => path.parse(f).name);

// Find wikitexts without corresponding markdown
const notConverted = wikitextFiles.filter(name => !markdownFiles.includes(name));

console.log('create md files for all of these, read them in batches of 10 then create the files, repeat the process until fully exhausted:');
notConverted.forEach(name => console.log(name));
