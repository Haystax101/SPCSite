const fs = require('fs');

let ts = fs.readFileSync('src/hooks/useScene.ts', 'utf8');

// Stop entire workflow section fading out
ts = ts.replace(
  /workflowSection\.style\.opacity = Math\.max\(0, Math\.min\(1, sectionIn \* sectionOut\)\)\.toFixed\(4\);/,
  `workflowSection.style.opacity = Math.max(0, Math.min(1, sectionIn)).toFixed(4);`
);

// We need to inject the specific fade-out logic into `updateWorkflowState`
const updatedLogic = `
      // Fade out specific workflow background elements during inbox transition
      const outP = smoothstep(1.0, 1.10, scrollProgress);
      const bgOpacity = (1.0 - outP).toFixed(4);
      
      const grid = document.getElementById('wf-bg-grid');
      const textDiv = document.getElementById('wf-bg-text');
      const lines = document.getElementById('workflow-lines');
      
      if (grid) grid.style.opacity = bgOpacity;
      if (textDiv) textDiv.style.opacity = bgOpacity;
      if (lines) lines.style.opacity = bgOpacity;

      // Handle the nodes
      if (document.getElementById('wf-node-david')) document.getElementById('wf-node-david').style.opacity = bgOpacity;
      if (document.getElementById('wf-node-stats')) document.getElementById('wf-node-stats').style.opacity = bgOpacity;

      const pInbox = smoothstep(1.05, 1.20, scrollProgress);
      
      // Animate the 3 cards across arc 
      const sarah = document.getElementById('wf-node-sarah');
      const michael = document.getElementById('wf-node-michael');
      const elena = document.getElementById('wf-node-elena');

      // Common arc function for left-x
      // They start at 85%, end at 50%
      const arcLeft = 85 - (35 * pInbox);
      // They also grow a bit to stand out more (scale 0.95 -> 1.1)
      const targetScale = 0.95 + (0.15 * pInbox);

      if (michael) {
        // Starts at 75%, Urgent priority goes to top 55%
        const startTop = 75;
        const endTop = 55;
        const arcTop = startTop + (endTop - startTop) * pInbox - Math.sin(pInbox * Math.PI) * 15; // arc curve
        michael.style.top = \`\${arcTop}%\`;
        michael.style.left = \`\${arcLeft}%\`;
        michael.style.transform = \`translate(-50%, -50%) scale(\${targetScale})\`;
        michael.style.zIndex = Math.round(pInbox) * 10;
      }

      if (elena) {
        // Starts at 50%, High priority goes to middle 67%
        const startTop = 50;
        const endTop = 67;
        const arcTop = startTop + (endTop - startTop) * pInbox - Math.sin(pInbox * Math.PI) * 10;
        elena.style.top = \`\${arcTop}%\`;
        elena.style.left = \`\${arcLeft}%\`;
        elena.style.transform = \`translate(-50%, -50%) scale(\${targetScale})\`;
        elena.style.zIndex = Math.round(pInbox) * 9;
      }

      if (sarah) {
        // Starts at 25%, Normal priority goes to bottom 79%
        const startTop = 25;
        const endTop = 79;
        const arcTop = startTop + (endTop - startTop) * pInbox - Math.sin(pInbox * Math.PI) * 5;
        sarah.style.top = \`\${arcTop}%\`;
        sarah.style.left = \`\${arcLeft}%\`;
        sarah.style.transform = \`translate(-50%, -50%) scale(\${targetScale})\`;
        sarah.style.zIndex = Math.round(pInbox) * 8;
      }
`;

// Insert the new logic right before `paths.forEach` because we don't want to break path bounding rect calculations when elements pop around.
// Well, wait. `paths.forEach` evaluates `tgtRect`. If we moved Elena, the pipes will follow her, which is OK! Because we faded out `lines.style.opacity = bgOpacity;`.
ts = ts.replace(
  /const paths = \[/,
  `${updatedLogic}\n      const paths = [`
);

fs.writeFileSync('src/hooks/useScene.ts', ts);
console.log('Fixed GSAP arc movement!');
