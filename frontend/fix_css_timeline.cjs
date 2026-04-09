const fs = require('fs');

// 1. Update CSS
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/height: 900vh;/, 'height: 1125vh;');
fs.writeFileSync('src/index.css', css);

// 2. Update useScene.ts
let ts = fs.readFileSync('src/hooks/useScene.ts', 'utf8');

// The line: `scrollProgress = self.progress;`
ts = ts.replace(
  /scrollProgress = self\.progress;/,
  `scrollProgress = self.progress * 1.25;`
);

// Add timeline labels for inbox
ts = ts.replace(
  /masterTl\.addLabel\('section-workflow-end', 1\.0\);/,
  `masterTl.addLabel('section-workflow-end', 1.0);\n      masterTl.addLabel('section-inbox', 1.25);`
);

// update workflow out
ts = ts.replace(
  /const p = clamp01\(scrollProgress\);\n\s*const sectionIn = smoothstep\(0\.90, 0\.97, p\);\n\s*workflowSection\.style\.opacity = clamp01\(sectionIn\)\.toFixed\(4\);/,
  `const p = Math.min(1.25, Math.max(0, scrollProgress));\n      const sectionIn = smoothstep(0.90, 0.97, scrollProgress);\n      const sectionOut = 1.0 - smoothstep(1.02, 1.10, scrollProgress);\n      workflowSection.style.opacity = Math.max(0, Math.min(1, sectionIn * sectionOut)).toFixed(4);`
);

// update inbox section opacity in updateOpacityState
ts = ts.replace(
  /updateWorkflowState\(\);/,
  `updateWorkflowState();\n\n      const inboxSection = document.getElementById('inbox-section');\n      if (inboxSection) {\n        const inboxIn = smoothstep(1.05, 1.15, scrollProgress);\n        inboxSection.style.opacity = Math.max(0, Math.min(1, inboxIn)).toFixed(4);\n        inboxSection.style.transform = \`translateY(\${(1 - inboxIn) * 30}px)\`;\n      }`
);

fs.writeFileSync('src/hooks/useScene.ts', ts);

console.log('Fixed CSS and GSAP Timeline!');
