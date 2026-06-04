const fs = require('fs');

const content = fs.readFileSync('/c/azurbank/translations.ts', 'utf8');
const lines = content.split('\n');

// Find TRANSLATIONS = { line and closing }
const startIdx = lines.findIndex(l => l.trim() === 'export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {');
const endIdx = lines.length - 1; // last line is };

// Find language block boundaries
const langBlocks = []; // { lang, startLine, endLine }
let currentLang = null;
let braceCount = 0;

for (let i = startIdx; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  const langMatch = trimmed.match(/^([a-z]{2}): \{$/);
  if (langMatch && braceCount === 0) {
    currentLang = { lang: langMatch[1], startLine: i };
  }

  if (currentLang) {
    // Count braces
    for (const ch of line) {
      if (ch === '{') braceCount++;
      if (ch === '}') braceCount--;
    }

    // End of this block (braceCount back to 0 means we closed the lang block)
    // But the block ends with "}," at the end - look for:  },  (indented)
    if (trimmed === '},' && braceCount === 0 && i > startIdx) {
      currentLang.endLine = i;
      langBlocks.push(currentLang);
      currentLang = null;
    }
  }
}

console.log('Found blocks:', langBlocks.map(b => `${b.lang}: ${b.startLine}-${b.endLine}`));

// Process each language block
for (const block of langBlocks) {
  const blockLines = lines.slice(block.startLine, block.endLine + 1);
  const seen = new Map(); // key -> value (last occurrence wins)
  const duplicateCount = { dup: 0 };

  const cleanedLines = blockLines.filter((line, idx) => {
    // Skip the first line (lang: {)
    if (idx === 0) return true;
    // Skip the last line (},)
    if (idx === blockLines.length - 1) return true;
    // Skip blank lines
    if (line.trim() === '') return true;
    // Skip comment lines
    if (line.trim().startsWith('//')) return true;

    // Parse key: 'something': or "something":
    const keyMatch = line.match(/^(\s+)['"]?([\w.]+)['"]?\s*:/);
    if (keyMatch) {
      const key = keyMatch[2];
      if (seen.has(key)) {
        duplicateCount.dup++;
        return false; // remove duplicate
      }
      seen.set(key, true);
      return true;
    }
    return true;
  });

  console.log(`Block ${block.lang}: removed ${duplicateCount.dup} duplicate keys`);

  // Replace in lines array
  lines.splice(block.startLine, block.endLine - block.startLine + 1, ...cleanedLines);
  
  // Fix the closing brace (last line of block should be "  }," not just "}")
  // Find the new position
}

// Now add commas and proper closing braces back
// Find each lang block again by looking for pattern '  xx: {'
for (let i = startIdx + 1; i < lines.length; i++) {
  const trimmed = lines[i].trim();
  const langMatch = trimmed.match(/^([a-z]{2}): \{?$/);
  if (langMatch && trimmed !== '};') {
    const nextLine = lines[i + 1]?.trim() || '';
    if (!nextLine.startsWith("'") && !nextLine.startsWith('"')) {
      // No key on next line - this is an empty block, add one
    }
  }
}

fs.writeFileSync('/c/azurbank/translations.ts', lines.join('\n'));
console.log('Done!');
