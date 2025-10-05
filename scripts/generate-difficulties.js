#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const { PNG } = require("pngjs");
const unidecode = require("unidecode");

const ROOT = path.resolve(__dirname, "..");
const DIFFICULTIES_JSON_PATH = path.join(ROOT, "difficulties.json");
const INDEX_TS_PATH = path.join(ROOT, "src", "index.ts");
const ASSETS_DIR = path.join(ROOT, "assets");
const OUTPUT_TS_PATH = path.join(ROOT, "src", "generatedDifficulties.ts");

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function readIndexMetadata(filePath) {
  const sourceText = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    path.basename(filePath),
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  const difficulties = new Map();

  const visitClass = (node) => {
    if (!ts.isClassDeclaration(node)) {
      return;
    }
    if (!node.name || node.name.text !== "Difficulty") {
      return;
    }

    for (const member of node.members) {
      if (!ts.isPropertyDeclaration(member) || !member.initializer) {
        continue;
      }
      const isStatic = member.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword);
      if (!isStatic) {
        continue;
      }

      const initializerData = extractInitializerData(member.initializer, sourceFile);
      if (!initializerData.name) {
        continue;
      }

      difficulties.set(initializerData.name, {
        layoutRating: initializerData.rating,
        class: initializerData.class,
        imagePath: initializerData.imagePath,
      });
    }
  };

  sourceFile.forEachChild((node) => {
    visitClass(node);
  });

  return difficulties;
}

function extractInitializerData(initializer, sourceFile) {
  const data = {
    name: undefined,
    rating: undefined,
    class: undefined,
    imagePath: undefined,
  };

  let current = initializer;

  while (ts.isCallExpression(current)) {
    const expression = current.expression;
    if (!ts.isPropertyAccessExpression(expression)) {
      break;
    }

    const methodName = expression.name.getText(sourceFile);
    const arg = current.arguments[0];
    switch (methodName) {
      case "setName":
        data.name = arg ? extractStringLiteral(arg, sourceFile) : data.name;
        break;
      case "setRating":
        data.rating = arg !== undefined ? extractNumericLiteral(arg, sourceFile) : data.rating;
        break;
      case "setClass":
        data.class = arg !== undefined ? extractNumericLiteral(arg, sourceFile) : data.class;
        break;
      case "setImage":
        data.imagePath = arg ? extractImagePath(arg, sourceFile) : data.imagePath;
        break;
      default:
        break;
    }

    current = expression.expression;
  }

  return data;
}

function extractStringLiteral(node, sourceFile) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  return undefined;
}

function extractNumericLiteral(node, sourceFile) {
  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }
  if (ts.isPrefixUnaryExpression(node)) {
    const value = extractNumericLiteral(node.operand, sourceFile);
    if (value === undefined) {
      return undefined;
    }
    switch (node.operator) {
      case ts.SyntaxKind.MinusToken:
        return -value;
      case ts.SyntaxKind.PlusToken:
        return value;
      default:
        return undefined;
    }
  }
  if (ts.isParenthesizedExpression(node)) {
    return extractNumericLiteral(node.expression, sourceFile);
  }
  return undefined;
}

function extractImagePath(node, sourceFile) {
  if (ts.isCallExpression(node)) {
    const expression = node.expression;
    if (
      ts.isIdentifier(expression) &&
      expression.text === "getAsset" &&
      node.arguments.length > 0
    ) {
      const arg = node.arguments[0];
      return extractStringLiteral(arg, sourceFile);
    }
  }
  if (ts.isStringLiteral(node)) {
    return node.text;
  }
  return undefined;
}

function buildAssetLookup() {
  const files = fs.readdirSync(ASSETS_DIR);
  const lookupBySanitized = new Map();
  const lookupByExact = new Map();

  for (const file of files) {
    const full = path.join(ASSETS_DIR, file);
    if (!fs.statSync(full).isFile()) {
      continue;
    }
    const ext = path.extname(file).toLowerCase();
    if (ext !== ".png") {
      continue;
    }
    const base = path.basename(file, ext);
    lookupByExact.set(base, file);
    const sanitized = sanitizeKey(base);
    if (!lookupBySanitized.has(sanitized)) {
      lookupBySanitized.set(sanitized, file);
    }
  }

  return { lookupByExact, lookupBySanitized };
}

function sanitizeKey(input) {
  const ascii = unidecode(input || "").replace(/[^0-9A-Za-z]+/g, "");
  let key = ascii;
  if (!key) {
    return "";
  }
  if (/^[0-9]/.test(key)) {
    key = `_${key}`;
  }
  return key;
}

function getOutputKey(name, usedKeys, index) {
  let key = sanitizeKey(name);
  if (!key) {
    key = `_Difficulty${index}`;
  }
  let uniqueKey = key;
  let counter = 2;
  while (usedKeys.has(uniqueKey)) {
    uniqueKey = `${key}_${counter++}`;
  }
  usedKeys.add(uniqueKey);
  return uniqueKey;
}

function findAssetFile(name, explicitPath, lookup) {
  if (explicitPath) {
    const relative = explicitPath.startsWith("assets/")
      ? explicitPath.slice("assets/".length)
      : explicitPath;
    if (lookup.lookupByExact.has(path.basename(relative, path.extname(relative)))) {
      return relative;
    }
    const explicitFull = path.join(ASSETS_DIR, relative);
    if (fs.existsSync(explicitFull)) {
      return relative;
    }
  }

  const candidates = [];
  candidates.push(name);
  candidates.push(name.replace(/'/g, "&#39;"));

  for (const candidate of candidates) {
    const exact = lookup.lookupByExact.get(candidate);
    if (exact) {
      return `${exact}`;
    }
    const sanitized = sanitizeKey(candidate);
    const match = lookup.lookupBySanitized.get(sanitized);
    if (match) {
      return match;
    }
  }

  return undefined;
}

function computeAverageColor(fileName, warnings) {
  if (!fileName) {
    return { r: 0, g: 0, b: 0 };
  }
  const fullPath = path.join(ASSETS_DIR, fileName);
  if (!fs.existsSync(fullPath)) {
    return { r: 0, g: 0, b: 0 };
  }
  let png;
  try {
    const buffer = fs.readFileSync(fullPath);
    png = PNG.sync.read(buffer);
  } catch (error) {
    warnings?.push(`Failed to read image data for "${fileName}": ${error.message}`);
    return { r: 0, g: 0, b: 0 };
  }
  let rTotal = 0;
  let gTotal = 0;
  let bTotal = 0;
  let totalWeight = 0;

  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i];
    const g = png.data[i + 1];
    const b = png.data[i + 2];
    const a = png.data[i + 3] / 255;
    if (a === 0) {
      continue;
    }
    rTotal += r * a;
    gTotal += g * a;
    bTotal += b * a;
    totalWeight += a;
  }

  if (totalWeight === 0) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: Math.round(rTotal / totalWeight),
    g: Math.round(gTotal / totalWeight),
    b: Math.round(bTotal / totalWeight),
  };
}

function buildGeneratedObject() {
  const difficultiesJson = readJson(DIFFICULTIES_JSON_PATH);
  const indexMetadata = readIndexMetadata(INDEX_TS_PATH);
  const assetLookup = buildAssetLookup();
  const output = new Map();
  const usedKeys = new Set();

  const warnings = [];
  let counter = 0;

  for (const [name, info] of Object.entries(difficultiesJson)) {
    counter += 1;
    const key = getOutputKey(name, usedKeys, counter);

    const indexInfo = indexMetadata.get(name) || indexMetadata.get(name.trim());
    if (!indexInfo) {
      warnings.push(`Missing index metadata for difficulty "${name}"`);
    }

    const visualRating = info?.rating ?? "";
    const description = info?.description ?? "";

    const assetFile = findAssetFile(
      name,
      indexInfo?.imagePath,
      assetLookup
    );
    if (!assetFile) {
      warnings.push(`No asset found for difficulty "${name}"`);
    }

    const color = computeAverageColor(assetFile, warnings);

    // Determine layoutRating: use visualRating if it's parsable as a number, otherwise fallback to indexInfo
    let layoutRating = indexInfo?.layoutRating ?? 0;
    const visualRatingStr = typeof visualRating === "string" ? visualRating : String(visualRating ?? "");
    const parsedVisualRating = parseFloat(visualRatingStr);
    if (!isNaN(parsedVisualRating) && isFinite(parsedVisualRating)) {
      layoutRating = parsedVisualRating;
    }

    const entry = {
      name,
      visualRating: visualRatingStr,
      layoutRating: layoutRating,
      description: typeof description === "string" ? description : "",
      class: indexInfo?.class ?? 0,
      colorR: color.r,
      colorG: color.g,
      colorB: color.b,
    };

    output.set(key, entry);
  }

  return { output, warnings };
}

function formatEntryValue(entry, indent) {
  const lines = [];
  const pad = " ".repeat(indent);
  lines.push(`${pad}name: ${JSON.stringify(entry.name)},`);
  lines.push(`${pad}visualRating: ${JSON.stringify(entry.visualRating)},`);
  lines.push(`${pad}layoutRating: ${entry.layoutRating},`);
  lines.push(`${pad}description: ${JSON.stringify(entry.description)},`);
  lines.push(`${pad}class: ${entry.class},`);
  lines.push(`${pad}colorR: ${entry.colorR},`);
  lines.push(`${pad}colorG: ${entry.colorG},`);
  lines.push(`${pad}colorB: ${entry.colorB}`);
  return lines.join("\n");
}

function writeOutputFile(outputMap) {
  const entries = Array.from(outputMap.entries());
  entries.sort((a, b) => a[0].localeCompare(b[0]));

  const lines = [];
  lines.push("/* eslint-disable */");
  lines.push("// This file is auto-generated by scripts/generate-difficulties.js");
  lines.push("export const GENERATED_DIFFICULTIES = {");

  for (const [key, value] of entries) {
    const isIdentifier = /^[A-Za-z_][A-Za-z0-9_]*$/.test(key);
    const keyOutput = isIdentifier ? key : JSON.stringify(key);
    lines.push(`  ${keyOutput}: {`);
    lines.push(formatEntryValue(value, 4));
    lines.push("  },");
  }

  lines.push("} as const;");
  lines.push("\nexport type GeneratedDifficultyKey = keyof typeof GENERATED_DIFFICULTIES;");
  lines.push("export type GeneratedDifficulty = typeof GENERATED_DIFFICULTIES[GeneratedDifficultyKey];");

  const content = lines.join("\n");
  fs.writeFileSync(OUTPUT_TS_PATH, content, "utf8");
}

function main() {
  const { output, warnings } = buildGeneratedObject();
  writeOutputFile(output);
  if (warnings.length > 0) {
    console.warn("Generation completed with warnings:");
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  } else {
    console.log("Generation completed successfully.");
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error("Failed to generate difficulties:", error);
    process.exitCode = 1;
  }
}
