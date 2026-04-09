const fs = require('fs');
let code = fs.readFileSync('src/hooks/useScene.ts', 'utf8');

// 1. Fix snap settings
code = code.replace(
  /snap:\s*\{\s*snapTo:\s*'labelsDirectional',\s*duration:\s*\{[^}]*\},\s*delay:\s*[\d.]+,\s*ease:\s*'[^']+'\s*\}/,
  `snap: {
            snapTo: 'labelsDirectional',
            duration: { min: 0.1, max: 0.35 },
            delay: 0.01,
            ease: 'power2.inOut'
          }`
);

// 2. Fix David positioning & scale
code = code.replace(
  /const startLeft = 35;\s*const endLeft = 72;\s*const startTop = 46;\s*const endTop = 50;\s*const nextLeft = startLeft \+ \(endLeft - startLeft\) \* reveal;\s*const nextTop = startTop \+ \(endTop - startTop\) \* reveal;\s*nodeDavid\.style\.left = `\$\{nextLeft\.toFixed\(3\)\}%`;\s*nodeDavid\.style\.top = `\$\{nextTop\.toFixed\(3\)\}%`;\s*nodeDavid\.style\.opacity = \(1 - workflowTakeover\)\.toFixed\(4\);/,
  `const startLeft = 45;
        const endLeft = 72;
        const startTop = 46;
        const endTop = 50;
        const nextLeft = startLeft + (endLeft - startLeft) * reveal;
        const nextTop = startTop + (endTop - startTop) * reveal;
        nodeDavid.style.left = \`\${nextLeft.toFixed(3)}%\`;
        nodeDavid.style.top = \`\${nextTop.toFixed(3)}%\`;
        nodeDavid.style.opacity = (1 - workflowTakeover).toFixed(4);
        nodeDavid.setAttribute('data-large', reveal > 0.01 ? 'true' : 'false');`
);

// 3. Add final snap label
code = code.replace(
  /masterTl\.addLabel\('section-workflow',\s*0\.98\);/,
  `masterTl.addLabel('section-workflow', 0.98);
      masterTl.addLabel('section-workflow-end', 1.0);`
);

fs.writeFileSync('src/hooks/useScene.ts', code);
console.log('updated useScene.ts');
