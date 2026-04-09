const fs = require('fs');
const content = fs.readFileSync('src/hooks/useScene.ts', 'utf8');

const anchorStart = 'function updateWorkflowState() {';
const startIdx = content.indexOf(anchorStart);
const anchorEnd = 'function applySceneState() {';
const endIdx = content.indexOf(anchorEnd);

if (startIdx === -1 || endIdx === -1) {
  console.log('Could not find anchors.');
  process.exit(1);
}

const replaceWith = `function updateWorkflowState() {
      const workflowSection = document.getElementById('workflow-section');
      if (!workflowSection) return;

      const p = clamp01(scrollProgress);
      const sectionIn = smoothstep(0.90, 0.97, p);
      workflowSection.style.opacity = clamp01(sectionIn).toFixed(4);

      const wfNodes = [
        { id: 'david', delay: 0.00 },
        { id: 'stats', delay: 0.15 },
        { id: 'elena', delay: 0.35 }
      ];

      wfNodes.forEach(node => {
        const el = document.getElementById(\`wf-node-\${node.id}\`);
        if (el) {
          const pop = smoothstep(0.91 + node.delay * 0.04, 0.96 + node.delay * 0.04, p);
          el.style.opacity = pop.toFixed(4);
          el.style.transform = \`translate(-50%, -50%) scale(\${(0.85 + 0.15 * pop).toFixed(4)})\`;
        }
      });

      const paths = [
        { id: 'path-david-stats-1', src: 'david', tgt: 'stats', srcOff: -0.25, tgtOff: -0.25 },
        { id: 'path-david-stats-2', src: 'david', tgt: 'stats', srcOff: 0, tgtOff: 0 },
        { id: 'path-david-stats-3', src: 'david', tgt: 'stats', srcOff: 0.25, tgtOff: 0.25 },
        { id: 'path-stats-elena-1', src: 'stats', tgt: 'elena', srcOff: -0.25, tgtOff: 0 },
        { id: 'path-stats-elena-2', src: 'stats', tgt: 'elena', srcOff: 0, tgtOff: 0 },
        { id: 'path-stats-elena-3', src: 'stats', tgt: 'elena', srcOff: 0.25, tgtOff: 0 }
      ];

      const svgNode = document.getElementById('workflow-lines');
      if (svgNode) {
        const svgRect = svgNode.getBoundingClientRect();
        paths.forEach((c, i) => {
          const path = document.getElementById(c.id) as unknown as SVGPathElement;
          if (!path) return;

          const src = document.getElementById(\`wf-node-\${c.src}\`);
          const tgt = document.getElementById(\`wf-node-\${c.tgt}\`);

          if (src && tgt) {
            const srcRect = src.getBoundingClientRect();
            const tgtRect = tgt.getBoundingClientRect();
            
            const x1 = srcRect.right - svgRect.left;
            const y1 = srcRect.top + srcRect.height * (0.5 + c.srcOff) - svgRect.top;
            
            const x2 = tgtRect.left - svgRect.left;
            const y2 = tgtRect.top + tgtRect.height * (0.5 + c.tgtOff) - svgRect.top;

            const dx = Math.max(30, (x2 - x1) * 0.4);
            path.setAttribute('d', \`M \${x1} \${y1} C \${x1 + dx} \${y1} \${x2 - dx} \${y2} \${x2} \${y2}\`);

            const currentP = smoothstep(0.92 + i * 0.015, 0.97 + i * 0.015, p);
            
            // Note: browser will need path length eventually, but we calculate an approx len to avoid crashing
            const len = 800;
            path.style.strokeDasharray = \`\${len}\`;
            path.style.strokeDashoffset = \`\${len * (1 - clamp01(currentP))}\`;
          }
        });
      }
    }

    `;

const newContent = content.slice(0, startIdx) + replaceWith + content.slice(endIdx);
fs.writeFileSync('src/hooks/useScene.ts', newContent);
console.log('Fixed useScene.ts');
