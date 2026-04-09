const fs = require('fs');

const content = fs.readFileSync('src/hooks/useScene.ts', 'utf8');

// Fix 1: Add canvas fade out logic to updateOpacityState
let newContent = content.replace(
      /if \(profileText\) \{([\s\S]*?)\}/,
      `if (profileText) {
          const profileIn = smoothstep(0.78, 0.85, scrollProgress);
          const profileOut = 1 - smoothstep(0.92, 0.985, scrollProgress);
          profileText.style.opacity = Math.max(0, Math.min(1, profileIn * profileOut)).toString();
        }
        
        const canvas = document.getElementById('network-canvas');
        if (canvas) {
          const fadeOutCanvas = smoothstep(0.72, 0.82, scrollProgress);
          canvas.style.opacity = (1 - fadeOutCanvas).toFixed(4);
        }`
);

// Fix 2: Modify updateWorkflowState path length to use getTotalLength
const anchor = '// Note: browser will need path length eventually, but we calculate an approx len to avoid crashing';
const anchorIdx = newContent.indexOf(anchor);
if (anchorIdx > -1) {
    const endTarget = newContent.indexOf('          }', anchorIdx);
    const replacement = `const currentP = smoothstep(0.92 + i * 0.015, 0.97 + i * 0.015, p);
            
            const len = path.getTotalLength() || 1000;
            path.style.strokeDasharray = \`\${len}\`;
            path.style.strokeDashoffset = \`\${len * (1 - clamp01(currentP))}\`;`;
    
    // We'll just replace the specific lines.
    const beforeBlock = newContent.substring(0, anchorIdx);
    // The previous text was:
    // const currentP = smoothstep(0.92 + i * 0.015, 0.97 + i * 0.015, p);
    //             
    // // Note: browser will need path length eventually, but we calculate an approx len to avoid crashing
    // const len = 800;
    // path.style.strokeDasharray = \`\${len}\`;
    // path.style.strokeDashoffset = \`\${len * (1 - clamp01(currentP))}\`;
    
    const startOfCurrentP = newContent.lastIndexOf('const currentP', anchorIdx);
    
    newContent = newContent.substring(0, startOfCurrentP) + replacement + newContent.substring(endTarget);
}

fs.writeFileSync('src/hooks/useScene.ts', newContent);
console.log('Fixed useScene.ts');
