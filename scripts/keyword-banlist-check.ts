#!/usr/bin/env tsx
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BANNED = ["Monica", "HARPA", "Sider"];
const PATTERNS = ["src/app", "messages"];

// Resolve paths relative to packages/website (cwd when run via npm run)
const ROOT = process.cwd();

function walkFiles(dir: string, ext: string[]): string[] {
  const results: string[] = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const s = statSync(full);
      if (s.isDirectory()) {
        results.push(...walkFiles(full, ext));
      } else if (ext.some((e) => full.endsWith(e))) {
        results.push(full);
      }
    }
  } catch {
    // directory doesn't exist — skip silently
  }
  return results;
}

const files: string[] = [
  ...walkFiles(join(ROOT, "src/app"), [".tsx"]),
  ...walkFiles(join(ROOT, "messages"), [".json"]),
];

let violations = 0;

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const term of BANNED) {
      let col = line.indexOf(term);
      while (col !== -1) {
        const relPath = file.startsWith(ROOT) ? file.slice(ROOT.length + 1) : file;
        console.error(`BANNED TERM: ${relPath}:${i + 1}:${col + 1}: "${term}"`);
        violations++;
        col = line.indexOf(term, col + 1);
      }
    }
  }
}

if (violations === 0) {
  console.log("keyword-banlist-check: OK (0 violations)");
} else {
  console.error(`keyword-banlist-check: FAILED (${violations} violation${violations === 1 ? "" : "s"})`);
}

process.exit(violations === 0 ? 0 : 1);
