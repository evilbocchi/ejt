const fs = require('fs');
const path = require('path');

// Read the index.ts file
const indexPath = path.join(__dirname, '..', 'src', 'index.ts');
const content = fs.readFileSync(indexPath, 'utf-8');

// Regular expression to match static readonly difficulty definitions
const difficultyPattern = /static readonly (\w+) = new Difficulty\(\)\s*([\s\S]*?)(?=static readonly|\n\n\s*name:)/g;

const difficulties = [];
let match;

while ((match = difficultyPattern.exec(content)) !== null) {
	const propertyName = match[1];
	const body = match[2];
	
	// Extract name
	const nameMatch = body.match(/\.setName\("([^"]*)"\)/);
	const name = nameMatch ? nameMatch[1] : null;
	
	// Extract color RGB values
	const colorMatch = body.match(/\.setColor\(Color3\.fromRGB\((\d+),\s*(\d+),\s*(\d+)\)\)/);
	const color = colorMatch ? {
		r: parseInt(colorMatch[1]),
		g: parseInt(colorMatch[2]),
		b: parseInt(colorMatch[3])
	} : null;
	
	// Extract layoutRating
	const layoutRatingMatch = body.match(/\.setLayoutRating\(([-\d.]+)\)/);
	const layoutRating = layoutRatingMatch ? parseFloat(layoutRatingMatch[1]) : null;
	
	// Extract class
	const classMatch = body.match(/\.setClass\(([-\d]+)\)/);
	const difficultyClass = classMatch ? parseInt(classMatch[1]) : null;
	
	// Extract image (optional)
	const imageMatch = body.match(/\.setImage\(getAsset\("([^"]*)"\)\)/);
	const image = imageMatch ? imageMatch[1] : null;
	
	difficulties.push({
		propertyName,
		name,
		color,
		layoutRating,
		class: difficultyClass,
		image
	});
}

// Sort by layoutRating
difficulties.sort((a, b) => {
	if (a.layoutRating === null) return 1;
	if (b.layoutRating === null) return -1;
	return a.layoutRating - b.layoutRating;
});

// Write to JSON file
const outputPath = path.join(__dirname, '..', 'handwritten-difficulties.json');
fs.writeFileSync(outputPath, JSON.stringify(difficulties, null, 2));

console.log(`Extracted ${difficulties.length} handwritten difficulties to ${outputPath}`);
