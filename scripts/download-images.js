const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const { PNG } = require("pngjs");
const jpeg = require("jpeg-js");
const sharp = require("sharp");

const DIFFICULTIES_JSON = path.join(__dirname, "..", "difficulties", "difficulties.json");
const IMAGE_DIR = path.join(__dirname, "..", "difficulties", "image");
const IMAGE_SIZE = 50; // 50x50 pixels

/**
 * Get Fandom image URL for a specific size
 * All images are hosted on the jtohs-joke-towers wiki
 */
function getFandomImageUrl(imageFilename, size = 50) {
	// Always use jtohs-joke-towers wiki for images
	const wikiName = "jtohs-joke-towers";

	// Encode the filename properly for URLs
	const encodedFilename = encodeURIComponent(imageFilename);

	// Use Fandom's Special:FilePath endpoint which redirects to the actual image
	const baseUrl = `https://${wikiName}.fandom.com/wiki/Special:FilePath/${encodedFilename}`;
	const thumbnailUrl = `${baseUrl}?width=${size}&height=${size}`;

	return thumbnailUrl;
}

/**
 * Sanitize filename to be safe for filesystem
 */
function sanitizeFilename(filename) {
	// Decode HTML entities common in wiki filenames
	let sanitized = filename
		.replace(/&#39;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.trim();

	return sanitized;
}

/**
 * Sleep for a specified number of milliseconds
 */
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convert an image buffer to PNG format
 * Supports PNG, JPEG, WebP, and SVG
 */
async function convertToPng(buffer, originalFilename) {
	const ext = path.extname(originalFilename).toLowerCase();

	// If already PNG, return as-is
	if (ext === ".png") {
		return buffer;
	}

	// Use sharp for GIF, WebP, SVG (and other supported formats)
	if (ext === ".webp" || ext === ".svg" || ext === ".gif") {
		try {
			console.log(`  🔄 Converting ${ext} to PNG using sharp...`);
			// For GIFs, sharp will use the first frame by default
			const pngBuffer = await sharp(buffer)
				.resize(IMAGE_SIZE, IMAGE_SIZE, {
					fit: "contain",
					background: { r: 0, g: 0, b: 0, alpha: 0 },
				})
				.png()
				.toBuffer();
			return pngBuffer;
		} catch (error) {
			console.log(`    ⚠️  Sharp conversion failed: ${error.message}`);
			// Fall through to try other methods
		}
	}

	// Handle formats without sharp
	try {
		let imageData;

		if (ext === ".jpg" || ext === ".jpeg") {
			// Decode JPEG using jpeg-js
			const rawImageData = jpeg.decode(buffer);
			imageData = {
				data: rawImageData.data,
				width: rawImageData.width,
				height: rawImageData.height,
			};
		} else {
			// Try to decode as PNG anyway
			const png = PNG.sync.read(buffer);
			return buffer; // Already in PNG format
		}

		// Encode as PNG using pngjs
		const png = new PNG({
			width: imageData.width,
			height: imageData.height,
		});
		png.data = imageData.data;

		return PNG.sync.write(png);
	} catch (error) {
		console.log(`    ⚠️  Could not convert ${ext} to PNG: ${error.message}`);
		// Return original buffer if conversion fails
		return buffer;
	}
}

/**
 * Download a file to a temporary location and return the buffer
 */
function downloadToBuffer(url) {
	return new Promise((resolve, reject) => {
		const protocol = url.startsWith("https") ? https : http;

		protocol
			.get(url, (response) => {
				// Handle redirects
				if (response.statusCode === 301 || response.statusCode === 302) {
					return downloadToBuffer(response.headers.location).then(resolve).catch(reject);
				}

				if (response.statusCode !== 200) {
					return reject(
						new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`),
					);
				}

				const chunks = [];
				response.on("data", (chunk) => chunks.push(chunk));
				response.on("end", () => resolve(Buffer.concat(chunks)));
				response.on("error", reject);
			})
			.on("error", reject);
	});
}

async function main() {
	console.log("Loading difficulties.json...");

	// Load difficulties
	const difficulties = JSON.parse(fs.readFileSync(DIFFICULTIES_JSON, "utf8"));
	console.log(`Found ${difficulties.length} difficulties\n`);

	// Ensure image directory exists
	if (!fs.existsSync(IMAGE_DIR)) {
		fs.mkdirSync(IMAGE_DIR, { recursive: true });
		console.log(`Created directory: ${IMAGE_DIR}\n`);
	}

	// Track statistics
	const stats = {
		total: 0,
		skipped: 0,
		downloaded: 0,
		failed: 0,
		noImage: 0,
		converted: 0,
	};

	let jsonModified = false;

	// Process each difficulty
	for (let i = 0; i < difficulties.length; i++) {
		const difficulty = difficulties[i];
		const { name, image } = difficulty;
		const difficultyId = i; // Use array index as ID

		stats.total++;

		// Skip if no image specified
		if (!image || image.trim() === "") {
			console.log(`[${i + 1}/${difficulties.length}] ⏭️  ${name} - No image specified`);
			stats.noImage++;
			continue;
		}

		// Sanitize the original image filename
		const sanitizedOriginal = sanitizeFilename(image);


		// New filename based on sanitized difficulty name
		// Remove problematic characters for filenames
		const sanitizedName = sanitizeFilename(name)
			.replace(/[^a-zA-Z0-9 _\-\.]/g, "") // Remove non-filename-safe chars
			.replace(/\s+/g, " ") // Collapse whitespace
			.trim();
		const newFilename = `${sanitizedName}.png`;
		const outputPath = path.join(IMAGE_DIR, newFilename);


		// Skip if already exists
		if (fs.existsSync(outputPath)) {
			console.log(
				`[${i + 1}/${difficulties.length}] ⏭️  ${name} - Already exists (${newFilename})`,
			);
			stats.skipped++;

			// Update JSON if needed
			if (difficulty.image !== newFilename) {
				difficulty.image = newFilename;
				jsonModified = true;
			}
			continue;
		}

		// Try to download and convert the image
		try {
			const imageUrl = getFandomImageUrl(image, IMAGE_SIZE);
			console.log(`[${i + 1}/${difficulties.length}] 📥 Downloading ${name}...`);
			console.log(`  Original: ${sanitizedOriginal}`);
			console.log(`  New name: ${newFilename}`);
			console.log(`  URL: ${imageUrl}`);

			// Download to buffer
			const buffer = await downloadToBuffer(imageUrl);

			if (buffer.length === 0) {
				throw new Error("Downloaded file is empty");
			}

			console.log(`  📦 Downloaded (${buffer.length} bytes)`);

			// Convert to PNG if needed
			const ext = path.extname(sanitizedOriginal).toLowerCase();
			let finalBuffer = buffer;

			if (ext !== ".png") {
				console.log(`  🔄 Converting ${ext} to PNG...`);
				finalBuffer = await convertToPng(buffer, sanitizedOriginal);
				stats.converted++;
			}

			// Write to file
			fs.writeFileSync(outputPath, finalBuffer);

			const finalSize = fs.statSync(outputPath).size;
			console.log(`  ✅ Saved as ${newFilename} (${finalSize} bytes)\n`);
			stats.downloaded++;


			// Update the JSON with new filename
			if (difficulty.image !== newFilename) {
				difficulty.image = newFilename;
				jsonModified = true;
			}

			// Rate limiting - wait 500ms between requests
			await sleep(500);
		} catch (error) {
			console.log(`  ❌ Failed: ${error.message}\n`);
			stats.failed++;
		}
	}

	// Print summary
	console.log("=".repeat(80));
	console.log("SUMMARY");
	console.log("=".repeat(80));
	console.log(`Total difficulties: ${stats.total}`);
	console.log(`  ✅ Successfully downloaded: ${stats.downloaded}`);
	console.log(`  🔄 Converted to PNG: ${stats.converted}`);
	console.log(`  ⏭️  Skipped (already exist): ${stats.skipped}`);
	console.log(`  ❌ Failed: ${stats.failed}`);
	console.log(`  ℹ️  No image specified: ${stats.noImage}`);
	console.log("=".repeat(80));
}

// Run the script
main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
