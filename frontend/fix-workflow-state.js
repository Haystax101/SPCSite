const fs = require('fs');
const content = fs.readFileSync('src/hooks/useScene.ts', 'utf8');

const regex = /function updateWorkflowState\s*\(\)\s*\{[\s\S]*?(?=function applySceneState)/m;

const replacement = `function updateWorkflowState() {
      const workflowSection = document.getElementById('workflow-section');
      if (!workflowSection) return;

      const sectionIn = smoothstep(0.90, 0.97, scrollProgress);
      workflowSection.style.opacity = clamp01(sectionIn).toFixed(4);

      const nodes = [
        { id: 'david', delay: 0.00 },
        { id: 'elena', delay: 0.15 },
        { id: 'marcus', delay: 0.20 },
        { id: 'sarah', delay: 0.35 },
        { id: 'james', delay: 0.40 },
        { id: 'maya', delay: 0.50 }
      ];

      nodes.forEach(node => {
        const el = document.getElementById(\`wf-node-\${node.id}\`);
        if (el) {
          const pop = smoothstep(0.91 + node.delay * 0.05, 0.96 + node.delay * 0.05, scrollProgress);
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

      const svgRect = document.getElementById('workflow-lines')?.getBoundingClientRect();

      paths.forEach((pathId, i) => {
        const path = document.getElementById(pathId) as unknown as SVGPathElement;
        if (!path || !svgRect) return;

        const src = document.getElementById(\`wf-node-\${connections[i][0]}\`)?.getBoundingClientRect();
        const tgt = document.getElementById(\`wf-node-\${connections[i][1]}\`)?.getBoundingClientRect();

        if (src && tgt) {
          const x1 = src.right - svgRect.left;
          const y1 = src.top + src.height / 2 - svgRect.top;
          const x2 = tgt.left - svgRect.left;
          const y2 = tgt.top + tgt.height / 2 - svgRect.top;

          // Compute a gentle ease curve
          const dx = Math.max(30, (x2 - x1) * 0.4);
          path.setAttribute('d', \`M \${x1} \${y1} C \${x1 + dx} \${y1} \${x2 - dx} \${y2} \${x2} \${y2}\`);

          const progress = smoothstep(0.92 + i * 0.03, 0.97 + i * 0.03, scrollProgress);
          const len = path.getTotalLength();
          path.style.strokeDasharray = \`\${len}\`;
          path.style.strokeDashoffset = \`\${len * (1 - clamp01(progress))}\`;
        }
      });
    }

    `;

const newContent = content.replace(regex, replacement);
fs.writeFileSync('src/hooks/useScene.ts', newContent);
