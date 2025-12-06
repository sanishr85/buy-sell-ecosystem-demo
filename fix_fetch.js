const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/api/*.js');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace all instances of: await fetch`...`, {
  // With: await fetch(`...`, {
  content = content.replace(/await fetch`([^`]+)`,/g, 'await fetch($1`,');
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`✅ Fixed: ${file}`);
});

console.log('\n📋 Verification:');
const needsContent = fs.readFileSync('src/api/needs.js', 'utf8');
const fetchLines = needsContent.split('\n').filter(line => line.includes('await fetch'));
fetchLines.slice(0, 3).forEach(line => console.log(line.trim()));
