#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { PNG } = require("pngjs");
const unidecode = require("unidecode");

const ROOT = path.resolve(__dirname, "..");
const DIFFICULTIES_PATH = path.join(ROOT, "difficulties.json");
const MARKDOWN_DIR = path.join(ROOT, "difficulties", "markdown");
const IMAGE_DIR = path.join(ROOT, "difficulties", "image");
const ASSET_MAP_PATH = path.join(ROOT, "assetMap.ts");
const OUTPUT_PATH = path.join(ROOT, "src", "generated.ts");

function loadDifficulties() {
  const raw = fs.readFileSync(DIFFICULTIES_PATH, "utf8");
  return JSON.parse(raw);
}

function parseAssetMap() {
  const source = fs.readFileSync(ASSET_MAP_PATH, "utf8");
  const match = source.match(/export const assets = (\{[\s\S]*?\}) as const;/);
  if (!match) {
    throw new Error("Unable to locate assets object in assetMap.ts");
  }

  return vm.runInNewContext(`(${match[1]})`);
}

function normalizeLookup(value) {
  if (!value) {
    return "";
  }

  return unidecode(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function normalizeKey(value) {
  const ascii = unidecode(value ?? "");
  let cleaned = ascii.replace(/[^A-Za-z0-9]/g, "");
  if (!cleaned) {
    cleaned = "Difficulty";
  }

  if (!/[A-Za-z]/.test(cleaned[0])) {
    cleaned = `Difficulty${cleaned}`;
  }

  return cleaned;
}

function makeUniqueKey(base, usedKeys) {
  let key = base;
  let suffix = 2;
  while (usedKeys.has(key)) {
    key = `${base}${suffix}`;
    suffix += 1;
  }

  usedKeys.add(key);
  return key;
}

function buildMarkdownIndex() {
  const files = fs.readdirSync(MARKDOWN_DIR, { withFileTypes: true });
  const map = new Map();

  for (const entry of files) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }

    const base = entry.name.slice(0, -3);
    const normalized = normalizeLookup(base);
    if (!map.has(normalized)) {
      map.set(normalized, []);
    }

    map.get(normalized).push(entry.name);
  }

  return map;
}

function buildAssetIndex(assets) {
  const byFile = new Map();
  const byNormalized = new Map();

  for (const [key, value] of Object.entries(assets)) {
    if (!key.startsWith("assets/")) {
      continue;
    }

    const file = key.substring("assets/".length);
    byFile.set(file, { file, assetId: value });

    const base = path.parse(file).name;
    const normalized = normalizeLookup(base);
    if (!byNormalized.has(normalized)) {
      byNormalized.set(normalized, []);
    }

    byNormalized.get(normalized).push({ file, assetId: value });
  }

  return { byFile, byNormalized };
}

function stripHeading(markdown) {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  if (lines.length > 0 && /^#\s+/u.test(lines[0])) {
    lines.shift();
  }

  return lines.join("\n").trim();
}

async function getDescription(difficulty, markdownIndex) {
  const candidates = [difficulty.name, difficulty.wiki_name];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const normalized = normalizeLookup(candidate);
    const matches = markdownIndex.get(normalized);
    if (!matches || matches.length === 0) {
      continue;
    }

    // Prefer an exact (case-sensitive) base name match if present.
    const exact = matches.find((name) => name.slice(0, -3) === candidate);
    const fileName = exact ?? matches[0];
    const filePath = path.join(MARKDOWN_DIR, fileName);
    const content = await fs.promises.readFile(filePath, "utf8");
    return stripHeading(content);
  }

  return "";
}

function parseLayoutRating(rawRating, visualRating) {
  if (Number.isFinite(visualRating) || Number.isNaN(visualRating)) {
    return visualRating;
  }

  const text = (rawRating ?? "").toString();
  if (/^-|\(-/u.test(text) || text.includes("-∞")) {
    return Number.NEGATIVE_INFINITY;
  }

  return Number.POSITIVE_INFINITY;
}

function parseClassValue(rawClass) {
  if (typeof rawClass === "number") {
    return rawClass;
  }

  if (!rawClass) {
    return -2;
  }

  if (/Unclassified/i.test(rawClass)) {
    return -2;
  }

  if (/Class\s+Negative/i.test(rawClass)) {
    return -1;
  }

  const match = rawClass.match(/-?\d+/u);
  if (match) {
    return Number.parseInt(match[0], 10);
  }

  return -2;
}

function findAsset(difficulty, assetIndex) {
  const candidates = [];

  if (difficulty.image) {
    const baseImage = path.basename(difficulty.image);
    candidates.push({ type: "file", value: baseImage });
  }

  if (difficulty.name) {
    candidates.push({ type: "normalized", value: difficulty.name });
  }

  if (difficulty.wiki_name && difficulty.wiki_name !== difficulty.name) {
    candidates.push({ type: "normalized", value: difficulty.wiki_name });
  }

  for (const candidate of candidates) {
    if (candidate.type === "file") {
      const direct = assetIndex.byFile.get(candidate.value);
      if (direct) {
        return direct;
      }
    } else {
      const normalized = normalizeLookup(candidate.value);
      if (!normalized) {
        continue;
      }

      const matches = assetIndex.byNormalized.get(normalized);
      if (matches && matches.length === 1) {
        return matches[0];
      }

      if (matches && matches.length > 1) {
        const exact = matches.find((entry) => path.parse(entry.file).name === candidate.value);
        if (exact) {
          return exact;
        }
      }
    }
  }

  return null;
}

const colorCache = new Map();

async function readPngAverage(file) {
  if (!file) {
    return { colorR: 0, colorG: 0, colorB: 0 };
  }

  if (colorCache.has(file)) {
    return colorCache.get(file);
  }

  const fullPath = path.join(IMAGE_DIR, file);
  if (!fs.existsSync(fullPath)) {
    return { colorR: 0, colorG: 0, colorB: 0 };
  }

  const buffer = await fs.promises.readFile(fullPath);
  let png;
  try {
    png = PNG.sync.read(buffer);
  } catch (error) {
    console.warn(`Failed to process image ${file}: ${error.message}`);
    const fallback = { colorR: 0, colorG: 0, colorB: 0 };
    colorCache.set(file, fallback);
    return fallback;
  }
  const { data } = png;

  let totalWeight = 0;
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255;
    if (alpha === 0) {
      continue;
    }

    totalWeight += alpha;
    sumR += data[i] * alpha;
    sumG += data[i + 1] * alpha;
    sumB += data[i + 2] * alpha;
  }

  const color = totalWeight === 0
    ? { colorR: 0, colorG: 0, colorB: 0 }
    : {
        colorR: Math.round(sumR / totalWeight),
        colorG: Math.round(sumG / totalWeight),
        colorB: Math.round(sumB / totalWeight),
      };

  colorCache.set(file, color);
  return color;
}

function serializeNumber(value) {
  if (Number.isNaN(value)) {
    return "Number.NaN";
  }

  if (value === Number.POSITIVE_INFINITY) {
    return "math.huge";
  }

  if (value === Number.NEGATIVE_INFINITY) {
    return "-math.huge";
  }

  return Number(value).toString();
}

function escapeString(value) {
  return JSON.stringify(value ?? "");
}

function serializeGeneratedObject(obj) {
  const entries = Object.entries(obj);
  const lines = ["{\n"];

  for (let i = 0; i < entries.length; i += 1) {
    const [key, value] = entries[i];
    lines.push(`  ${key}: {\n`);
    lines.push(`    id: ${escapeString(key)},\n`);
    lines.push(`    name: ${escapeString(value.name)},\n`);
    lines.push(`    description: ${escapeString(value.description)},\n`);
    lines.push(`    visualRating: ${escapeString(value.visualRating)},\n`);
    lines.push(`    layoutRating: ${serializeNumber(value.layoutRating)},\n`);
    lines.push(`    class: ${serializeNumber(value.class)},\n`);
    lines.push(`    image: ${escapeString(value.image)},\n`);
    lines.push(`    colorR: ${serializeNumber(value.colorR)},\n`);
    lines.push(`    colorG: ${serializeNumber(value.colorG)},\n`);
    lines.push(`    colorB: ${serializeNumber(value.colorB)},\n`);
    lines.push("  }");
    if (i < entries.length - 1) {
      lines[lines.length - 1] += ",";
    }
    lines.push("\n");
  }

  lines.push("}\n");
  return lines.join("");
}

function buildFileContents(generated) {
  const objectLiteral = serializeGeneratedObject(generated);
  return `/** eslint-disable */\n// Auto-generated by scripts/generate-difficulties.js. Do not edit manually.\n\nexport interface GeneratedDifficultyEntry {\n  id: string;\n  name: string;\n  description: string;\n  visualRating: string;\n  layoutRating: number;\n  class: number;\n  image: string;\n  colorR: number;\n  colorG: number;\n  colorB: number;\n}\n\nexport const GENERATED_DIFFICULTIES: Record<string, GeneratedDifficultyEntry> = ${objectLiteral};\n\nexport type GeneratedDifficultyId = keyof typeof GENERATED_DIFFICULTIES;\n`;
}

async function main() {
  const difficulties = loadDifficulties();
  const assets = parseAssetMap();
  const assetIndex = buildAssetIndex(assets);
  const markdownIndex = buildMarkdownIndex();

  const usedKeys = new Set();
  const generated = {};

  for (const difficulty of difficulties) {
    const baseKey = normalizeKey(difficulty.name ?? difficulty.wiki_name ?? difficulty.image ?? "Difficulty");
    const key = makeUniqueKey(baseKey, usedKeys);

    const description = await getDescription(difficulty, markdownIndex);
    const visualRating = difficulty.rating;
    const layoutRating = parseLayoutRating(difficulty.rating, visualRating);
    const classValue = parseClassValue(difficulty.class);

    const assetInfo = findAsset(difficulty, assetIndex);
    const { colorR, colorG, colorB } = await readPngAverage(assetInfo?.file);
    const imageId = assetInfo?.assetId ?? "";

    generated[key] = {
      name: difficulty.name ?? "",
      description,
      visualRating,
      layoutRating,
      class: classValue,
      image: imageId,
      colorR,
      colorG,
      colorB,
    };
  }

  const fileContents = buildFileContents(generated);
  await fs.promises.writeFile(OUTPUT_PATH, fileContents, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
