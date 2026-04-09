const fs = require('fs');

let ts = fs.readFileSync('src/hooks/useScene.ts', 'utf8');

ts = ts.replace(
  /const sectionOut = 1\.0 - smoothstep\(1\.02, 1\.10, scrollProgress\);\n\s*workflowSection\.style\.opacity = Math\.max\(0, Math\.min\(1, sectionIn\)\)\.toFixed\(4\);/,
  `workflowSection.style.opacity = Math.max(0, Math.min(1, sectionIn)).toFixed(4);`
);

ts = ts.replace(
  /michael\.style\.zIndex = Math\.round\(pInbox\) \* 10;/,
  `michael.style.zIndex = (Math.round(pInbox) * 10).toString();`
);

ts = ts.replace(
  /elena\.style\.zIndex = Math\.round\(pInbox\) \* 9;/,
  `elena.style.zIndex = (Math.round(pInbox) * 9).toString();`
);

ts = ts.replace(
  /sarah\.style\.zIndex = Math\.round\(pInbox\) \* 8;/,
  `sarah.style.zIndex = (Math.round(pInbox) * 8).toString();`
);

fs.writeFileSync('src/hooks/useScene.ts', ts);
console.log('TypeScript errors fixed');
