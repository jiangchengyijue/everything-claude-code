// Extract YAML frontmatter name/description from all skills, agents, commands
const fs = require('fs');
const path = require('path');

function extractFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const frontmatter = match[1].replace(/\r/g, '');
  if (!match) return null;
  const fm = {};
  for (const line of frontmatter.split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) fm[m[1]] = m[1] === 'description' ? m[2].trim() : m[2].trim();
  }
  return fm;
}

const root = path.resolve(__dirname, '..');
const result = { skills: [], agents: [], commands: [] };

// Skills
const skillsDir = path.join(root, 'skills');
if (fs.existsSync(skillsDir)) {
  for (const dir of fs.readdirSync(skillsDir)) {
    const fp = path.join(skillsDir, dir, 'SKILL.md');
    if (fs.existsSync(fp)) {
      const fm = extractFrontmatter(fp);
      if (fm && fm.name) {
        result.skills.push({ file: `skills/${dir}/SKILL.md`, name: fm.name, description: fm.description || '' });
      }
    }
  }
}

// Agents
const agentsDir = path.join(root, 'agents');
if (fs.existsSync(agentsDir)) {
  for (const file of fs.readdirSync(agentsDir)) {
    if (file.endsWith('.md')) {
      const fp = path.join(agentsDir, file);
      const fm = extractFrontmatter(fp);
      if (fm && fm.name) {
        result.agents.push({ file: `agents/${file}`, name: fm.name, description: fm.description || '' });
      }
    }
  }
}

// Commands
const commandsDir = path.join(root, 'commands');
if (fs.existsSync(commandsDir)) {
  for (const file of fs.readdirSync(commandsDir)) {
    if (file.endsWith('.md')) {
      const fp = path.join(commandsDir, file);
      const fm = extractFrontmatter(fp);
      if (fm && fm.description) {
        const cmdName = file.replace(/\.md$/, '');
        result.commands.push({ file: `commands/${file}`, name: cmdName, description: fm.description });
      }
    }
  }
}

const outFile = path.join(root, 'translate-manifest.json');
fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
console.log(`Skills: ${result.skills.length}`);
console.log(`Agents: ${result.agents.length}`);
console.log(`Commands: ${result.commands.length}`);
console.log(`Total: ${result.skills.length + result.agents.length + result.commands.length}`);
console.log(`Written to ${outFile}`);
