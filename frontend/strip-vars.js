const fs = require('fs');
let code = fs.readFileSync('src/hooks/useScene.ts', 'utf8');

const varsToRemove = [
  'const workflowSection = document.getElementById',
  'const workflowDavidCard = document.getElementById',
  'const workflowDavidMatch = document.getElementById',
  'const workflowDavidDot = document.getElementById',
  'const workflowCenter = document.getElementById',
  'const workflowElenaCard = document.getElementById',
  'const workflowLinesSvg = document.getElementById',
];

code = code.split('\n').filter(line => {
  for (const v of varsToRemove) {
    if (line.includes(v)) return false;
  }
  // Additionally filter out the arrays
  return true;
}).join('\n');

// Also remove multiline arrays
code = code.replace(/const workflowLeftLines = \[[\s\S]*?\];/g, '');
code = code.replace(/const workflowRightLines = \[[\s\S]*?\];/g, '');
code = code.replace(/const workflowLeftDots = \[[\s\S]*?\];/g, '');
code = code.replace(/const workflowRightDots = \[[\s\S]*?\];/g, '');
code = code.replace(/function updateWorkflowLineGeometry\(\) \{[\s\S]*?\}\s*function updateWorkflowState/m, 'function updateWorkflowState');
code = code.replace(/function setWorkflowLineProgress\([\s\S]*?\}\s*function setWorkflowDotPosition\([\s\S]*?\}\s*function updateWorkflowState/m, 'function updateWorkflowState');

fs.writeFileSync('src/hooks/useScene.ts', code);
