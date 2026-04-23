const fs = require('fs');
const path = require('path');

const dirsToScan = [
  path.join(__dirname, 'src/components'), 
  path.join(__dirname, 'src/pages')
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Soften the entry distances
  content = content.replace(/x:\s*-100/g, 'x: -40');
  content = content.replace(/x:\s*100/g, 'x: 40');
  content = content.replace(/y:\s*30/g, 'y: 40');
  content = content.replace(/y:\s*50/g, 'y: 40');
  content = content.replace(/x:\s*-50(?!\d)/g, 'x: -40');
  content = content.replace(/x:\s*50(?!\d)/g, 'x: 40');

  // 2. Standardize Viewport Margin
  // If it's `viewport={{ once: true }}` without margin, add margin.
  content = content.replace(/viewport=\{\{\s*once:\s*true\s*\}\}/g, 'viewport={{ once: true, margin: "-100px" }}');

  // 3. Buttery Smooth Transitions
  // We want to add/replace the ease curve to [0.16, 1, 0.3, 1] 
  // and set duration to 1.2 for all explicit transition objects.
  content = content.replace(/transition=\{\{([^}]+)\}\}/g, (match, innerProps) => {
    if (innerProps.includes('[0.16, 1, 0.3, 1]')) return match;

    let props = innerProps;

    // Update or insert duration
    if (/duration:\s*[\d.]+/.test(props)) {
      props = props.replace(/duration:\s*[\d.]+/, 'duration: 1.2');
    } else {
      props += ', duration: 1.2';
    }

    // Update or insert ease
    if (/ease:\s*["'][a-zA-Z]+["']/.test(props)) {
      props = props.replace(/ease:\s*["'][a-zA-Z]+["']/, 'ease: [0.16, 1, 0.3, 1]');
    } else {
      props += ', ease: [0.16, 1, 0.3, 1]';
    }

    // Clean up commas
    props = props.replace(/,\s*,/g, ',');
    
    return `transition={{ ${props.trim()} }}`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

dirsToScan.forEach(scanDir);
console.log('Animation optimization complete.');
