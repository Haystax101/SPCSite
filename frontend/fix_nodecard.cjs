const fs = require('fs');
let code = fs.readFileSync('src/components/NodeCard.tsx', 'utf8');

// Change top-level transition from transition-all to transition-transform
code = code.replace(
  /className=\{\`absolute flex flex-col items-center group\/node cursor-pointer hover:scale-105 pointer-events-auto transition-all duration-300 \$\{className\}\`\}/g,
  `className={\`absolute flex flex-col items-center group/node cursor-pointer hover:scale-105 pointer-events-auto transition-transform duration-300 \${className}\`}`
);

fs.writeFileSync('src/components/NodeCard.tsx', code);
console.log('updated NodeCard');
