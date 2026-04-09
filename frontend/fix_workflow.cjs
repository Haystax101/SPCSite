const fs = require('fs');

let wf = fs.readFileSync('src/components/WorkflowSection.tsx', 'utf8');

const newNodes = `
      {/* Node 4: Sarah */}
      <div id="wf-node-sarah" className="workflow-card absolute flex items-center gap-3 w-[260px] p-3 border border-white/10 rounded-xl bg-[#111] shadow-2xl transition-all will-change-[transform,opacity] opacity-0" style={{top: '25%', left: '85%', transform: 'translate(-50%, -50%) scale(0.95)'}}>
        <img src="https://i.pravatar.cc/100?img=5" alt="Sarah Jenkins" className="w-10 h-10 rounded-md border border-white/20 object-cover" />
        <div className="flex flex-col gap-0.5 flex-1">
          <div className="text-white text-[14px] font-semibold tracking-tight">Sarah Jenkins</div>
          <div className="text-gray-400 text-[11px] font-medium leading-tight">VP of Growth</div>
        </div>
        <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#111] border-[2px] border-gray-500"></div>
      </div>

      {/* Node 5: Michael */}
      <div id="wf-node-michael" className="workflow-card absolute flex items-center gap-3 w-[260px] p-3 border border-white/10 rounded-xl bg-[#111] shadow-2xl transition-all will-change-[transform,opacity] opacity-0" style={{top: '75%', left: '85%', transform: 'translate(-50%, -50%) scale(0.95)'}}>
        <img src="https://i.pravatar.cc/100?img=8" alt="Michael Chang" className="w-10 h-10 rounded-md border border-white/20 object-cover" />
        <div className="flex flex-col gap-0.5 flex-1">
          <div className="text-white text-[14px] font-semibold tracking-tight">Michael Chang</div>
          <div className="text-gray-400 text-[11px] font-medium leading-tight">Technical Founder</div>
        </div>
        <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#111] border-[2px] border-gray-500"></div>
      </div>
    </div>`;

wf = wf.replace(/    <\/div>\n\s*\);\n}/, newNodes + '\n  );\n}');
fs.writeFileSync('src/components/WorkflowSection.tsx', wf);

let ts = fs.readFileSync('src/hooks/useScene.ts', 'utf8');

// Update wfNodes array
ts = ts.replace(
  /const wfNodes = \[\n\s*\{ id: 'david', delay: 0\.00 \},\n\s*\{ id: 'stats', delay: 0\.15 \},\n\s*\{ id: 'elena', delay: 0\.35 \}\n\s*\];/,
  `const wfNodes = [
        { id: 'david', delay: 0.00 },
        { id: 'stats', delay: 0.15 },
        { id: 'elena', delay: 0.35 },
        { id: 'sarah', delay: 1.00 },
        { id: 'michael', delay: 1.00 }
      ];`
);

// Update paths array
ts = ts.replace(
  /const paths = \[\n\s*\{ id: 'path-david-stats-1', src: 'david', tgt: 'stats', srcOff: -0\.25, tgtOff: -0\.25 \},\n\s*\{ id: 'path-david-stats-2', src: 'david', tgt: 'stats', srcOff: 0, tgtOff: 0 \},\n\s*\{ id: 'path-david-stats-3', src: 'david', tgt: 'stats', srcOff: 0\.25, tgtOff: 0\.25 \},\n\s*\{ id: 'path-stats-elena-1', src: 'stats', tgt: 'elena', srcOff: -0\.25, tgtOff: 0 \},\n\s*\{ id: 'path-stats-elena-2', src: 'stats', tgt: 'elena', srcOff: 0, tgtOff: 0 \},\n\s*\{ id: 'path-stats-elena-3', src: 'stats', tgt: 'elena', srcOff: 0\.25, tgtOff: 0 \}\n\s*\];/,
  `const paths = [
        { id: 'path-david-stats-1', src: 'david', tgt: 'stats', tgtAlt: 'stats', srcOff: -0.25, tgtOff: -0.25 },
        { id: 'path-david-stats-2', src: 'david', tgt: 'stats', tgtAlt: 'stats', srcOff: 0, tgtOff: 0 },
        { id: 'path-david-stats-3', src: 'david', tgt: 'stats', tgtAlt: 'stats', srcOff: 0.25, tgtOff: 0.25 },
        { id: 'path-stats-elena-1', src: 'stats', tgt: 'elena', tgtAlt: 'sarah', srcOff: -0.25, tgtOff: 0 },
        { id: 'path-stats-elena-2', src: 'stats', tgt: 'elena', tgtAlt: 'elena', srcOff: 0, tgtOff: 0 },
        { id: 'path-stats-elena-3', src: 'stats', tgt: 'elena', tgtAlt: 'michael', srcOff: 0.25, tgtOff: 0 }
      ];`
);

// Update path drawing logic
ts = ts.replace(
  /const x2 = tgtRect\.left - svgRect\.left;\n\s*const y2 = tgtRect\.top \+ tgtRect\.height \* \(0\.5 \+ c\.tgtOff\) - svgRect\.top;\n\n\s*const dx = Math\.max\(30, \(x2 - x1\) \* 0\.4\);\n\s*path\.setAttribute\('d', \`M \$\{x1\} \$\{y1\} C \$\{x1 \+ dx\} \$\{y1\} \$\{x2 - dx\} \$\{y2\} \$\{x2\} \$\{y2\}\`\);/,
  `let x2 = tgtRect.left - svgRect.left;
            let y2 = tgtRect.top + tgtRect.height * (0.5 + c.tgtOff) - svgRect.top;

            if (c.tgtAlt && c.tgt !== c.tgtAlt) {
              const splitProgress = smoothstep(0.965, 0.995, p);
              const tgtAlt = document.getElementById(\`wf-node-\${c.tgtAlt}\`);
              if (tgtAlt) {
                const altRect = tgtAlt.getBoundingClientRect();
                const altX2 = altRect.left - svgRect.left;
                const altY2 = altRect.top + altRect.height * (0.5 + c.tgtOff) - svgRect.top;
                
                x2 = x2 + (altX2 - x2) * splitProgress;
                y2 = y2 + (altY2 - y2) * splitProgress;
              }
            }

            const dx = Math.max(30, (x2 - x1) * 0.4);
            path.setAttribute('d', \`M \${x1} \${y1} C \${x1 + dx} \${y1} \${x2 - dx} \${y2} \${x2} \${y2}\`);`
);

fs.writeFileSync('src/hooks/useScene.ts', ts);
console.log('Fixed workflow!');
