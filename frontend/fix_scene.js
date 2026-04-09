const fs = require('fs');
let text = fs.readFileSync('src/hooks/useScene.ts', 'utf8');

// Replace everything from function updateWorkflowLineGeometry() to function applySceneState()
const startStr = 'function updateWorkflowLineGeometry()';
const endStr = 'function applySceneState()';

const startIdx = text.indexOf(startStr);
const endIdx = text.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `
    function updateWorkflowState() {
      const section = document.getElementById('workflow-section');
      if (!section) return;

      const p = clamp01(scrollProgress);
      const sectionIn = smoothstep(0.90, 0.97, p);
      section.style.opacity = clamp01(sectionIn).toFixed(4);

      const nodesArr = [
        { id: 'david', delay: 0.00 },
        { id: 'elena', delay: 0.15 },
        { id: 'marcus', delay: 0.20 },
        { id: 'sarah', delay: 0.35 },
        { id: 'james', delay: 0.40 },
        { id: 'maya', delay: 0.50 }
      ];

      nodesArr.forEach(node => {
        const el = document.getElementById(\`wf-node-\${node.id}\`);
        if (el) {
          const pop = smoothstep(0.91 + node.delay * 0.05, 0.96 + node.delay * 0.05, p);
          el.style.opacity = pop.toFixed(4);
          el.style.transform = \`translate(-50%, -50%) scale(\${(0.85 + 0.15 * pop).toFixed(4)})\`;
        }
      });

      const paths = ['path-david-elena', 'path-david-marcus', 'path-david-sarah', 'path-elena-james', 'path-marcus-maya'];
      const connections = [
        ['david', 'elena'],
        ['david', 'marcus'],
        ['david', 'sarah'],
        ['elena', 'james'],
        ['marcus', 'maya']
      ];

      const svgNode = document.getElementById('workflow-lines');
      if (svgNode) {
        const svgRect = svgNode.getBoundingClientRect();
        paths.forEach((pathId, i) => {
          const path = document.getElementById(pathId) as unknown as SVGPathElement;
          if (!path) return;

          const cx = connections[i];
          const src = document.getElementById(\`wf-node-\${cx[0]}\`);
          const tgt = document.getElementById(\`wf-node-\${cx[1]}\`);

          if (src && tgt) {
            const srcRect = src.getBoundingClientRect();
            const tgtRect = tgt.getBoundingClientRect();
            const x1 = srcRect.right - svgRect.left;
            const y1 = srcRect.top + srcRect.height / 2 - svgRect.top;
            const x2 = tgtRect.left - svgRect.left;
            const y2 = tgtRect.top + tgtRect.height / 2 - svgRect.top;

            const dx = Math.max(30, (x2 - x1) * 0.4);
            path.setAttribute('d', \`M \${x1} \${y1} C \${x1 + dx} \${y1} \${x2 - dx} \${y2} \${x2} \${y2}\`);

            const currentP = smoothstep(0.92 + i * 0.03, 0.97 + i * 0.03, p);
            const len = path.getTotalLength();
            path.style.strokeDasharray = \`\${len}\`;
            path.style.strokeDashoffset = \`\${len * (1 - clamp01(currentP))}\`;
          }
        });
      }
    }

    `;
  
  // also need to remove the previous updateWorkflowState if it wasn't caught
  const oldUpdate = text.indexOf('function updateWorkflowState()');
  if (oldUpdate !== -1 && oldUpdate < startIdx) {
      text = text.substring(0, oldUpdate) + replacement + text.substring(endIdx);
  } else {
      text = text.substring(0, startIdx) + replacement + text.substring(endIdx);
  }
  
  // also trim out all the unused DOM element vars at the top
  const badVars = [
    'const workflowSection',
    'const workflowDavidCard',
    'const workflowDavidMatch',
    'const workflowDavidDot',
    'const workflowCenter',
    'const workflowElenaCard',
    'const workflowLinesSvg',
    'document.getElementById(.workflow-left-line',
    'document.getElementById(.workflow-right-line',
    'document.getElementById(.workflow-dot-left',
    'document.getElementById(.workflow-dot-right',
  ];
  text = text.split('\\n').filter(line => {
    for (let bv of badVars) {
      if (line.includes(bv)) return false;
    }
    return true;
  }).join('\\n');

  text = text.replace(/const workflowLeftLines[\s\S]*?\];/g, '');
  text = text.replace(/const workflowRightLines[\s\S]*?\];/g, '');
  text = text.replace(/const workflowLeftDots[\s\S]*?\];/g, '');
  text = text.replace(/const workflowRightDots[\s\S]*?\];/g, '');
  text = text.replace(/function setWorkflowLineProgress[\s\S]*?function updateWorkflowState/m, 'function updateWorkflowState');
  
  fs.writeFileSync('src/hooks/useScene.ts', text);
}
