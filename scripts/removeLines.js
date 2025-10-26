const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'components', 'views', 'DashboardView.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Keep lines 0-244 and 790+
const newLines = [...lines.slice(0, 245), ...lines.slice(790)];
const newContent = newLines.join('\n');

fs.writeFileSync(filePath, newContent);
console.log('Successfully removed hardcoded theatre allocations (lines 246-790)');
