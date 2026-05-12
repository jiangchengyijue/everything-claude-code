// Apply bilingual translations to skills, agents, and commands
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const mapPath = path.join(root, 'translate-map.json');

if (!fs.existsSync(mapPath)) {
  console.error('translate-map.json not found!');
  process.exit(1);
}

const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
let updated = 0;

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function updateFile(filePath, translations) {
  const fullPath = path.join(root, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`  SKIP (not found): ${filePath}`);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;

  // Update name field
  if (translations.name && translations.name !== translations.originalName) {
    const nameRegex = new RegExp('^(\\s*name:\\s*)' + escapeRegExp(translations.originalName) + '(\\s*)$', 'm');
    content = content.replace(nameRegex, '$1' + translations.name + '$2');
  }

  // Update description field
  if (translations.description && translations.description !== translations.originalDesc) {
    const descRegex = new RegExp('^(\\s*description:\\s*)' + escapeRegExp(translations.originalDesc) + '(\\s*)$', 'm');
    content = content.replace(descRegex, '$1' + translations.description + '$2');
  }

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    updated++;
    console.log(`  OK: ${filePath}`);
  } else {
    console.log(`  UNCHANGED: ${filePath}`);
  }
}

// Process skills
for (const [name, trans] of Object.entries(map.skills || {})) {
  const filePath = `skills/${name}/SKILL.md`;
  updateFile(filePath, {
    originalName: name,
    name: trans.name,
    originalDesc: trans.originalDesc,
    description: trans.description
  });
}

// Process agents
for (const [name, trans] of Object.entries(map.agents || {})) {
  const filePath = `agents/${name}.md`;
  updateFile(filePath, {
    originalName: name,
    name: trans.name,
    originalDesc: trans.originalDesc,
    description: trans.description
  });
}

// Process commands
for (const [name, trans] of Object.entries(map.commands || {})) {
  const filePath = `commands/${name}.md`;
  updateFile(filePath, {
    originalName: null,
    name: null,
    originalDesc: trans.originalDesc,
    description: trans.description
  });
}

console.log(`\nTotal updated: ${updated} files`);
