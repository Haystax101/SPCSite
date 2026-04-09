const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// Replace left/right mask with sliding mask
css = css.replace(
  /--left-mask: 0;\n\s*--right-mask: 0;/,
  `--mask-center: 20%;\n    --slide-opacity: 1;`
);

css = css.replace(
  /linear-gradient\(to right,\n\s*rgba\(0, 0, 0, calc\(var\(--left-mask\) \* 0\.98\)\) 0%,\n\s*rgba\(0, 0, 0, calc\(var\(--left-mask\) \* 0\.96\)\) 44%,\n\s*rgba\(0, 0, 0, calc\(var\(--left-mask\) \* 0\.45\)\) 56%,\n\s*rgba\(0, 0, 0, 0\) 70%\),\n\s*linear-gradient\(to left,\n\s*rgba\(0, 0, 0, calc\(var\(--right-mask\) \* 0\.98\)\) 0%,\n\s*rgba\(0, 0, 0, calc\(var\(--right-mask\) \* 0\.96\)\) 44%,\n\s*rgba\(0, 0, 0, calc\(var\(--right-mask\) \* 0\.45\)\) 56%,\n\s*rgba\(0, 0, 0, 0\) 70%\),/,
  `linear-gradient(to right,
            rgba(0, 0, 0, 0) calc(var(--mask-center) - 45%),
            rgba(0, 0, 0, calc(var(--slide-opacity) * 0.98)) calc(var(--mask-center) - 20%),
            rgba(0, 0, 0, calc(var(--slide-opacity) * 0.96)) calc(var(--mask-center) + 20%),
            rgba(0, 0, 0, 0) calc(var(--mask-center) + 45%)),`
);

fs.writeFileSync('src/index.css', css);

let ts = fs.readFileSync('src/hooks/useScene.ts', 'utf8');
ts = ts.replace(
  /const heroIn = 1\.0 - smoothstep\(0\.28, 0\.37, p\);\n\s*const problemIn = smoothstep\(0\.26, 0\.36, p\) \* \(1\.0 - smoothstep\(0\.60, 0\.70, p\)\);\n\s*const visualiseIn = smoothstep\(0\.58, 0\.68, p\) \* \(1\.0 - smoothstep\(0\.80, 0\.90, p\)\);\n\s*const blackout = smoothstep\(0\.82, 1\.0, p\);\n\n\s*const leftMask = Math\.max\(0, heroIn \* \(1 - blackout\)\);\n\s*const rightMask = Math\.max\(0, problemIn \* \(1 - blackout\)\);\n\s*const ellipseMask = Math\.max\(0, visualiseIn \* \(1 - blackout\)\);\n\n\s*sectionMask\.style\.setProperty\('--left-mask', leftMask\.toFixed\(4\)\);\n\s*sectionMask\.style\.setProperty\('--right-mask', rightMask\.toFixed\(4\)\);/,
  `const slideProgress = smoothstep(0.20, 0.40, p);
      const maskCenter = 20 + 60 * slideProgress;
      const slideOpacity = (1.0 - smoothstep(0.60, 0.70, p)) * (1.0 - smoothstep(0.82, 1.0, p));

      const visualiseIn = smoothstep(0.58, 0.68, p) * (1.0 - smoothstep(0.80, 0.90, p));
      const blackout = smoothstep(0.82, 1.0, p);
      const ellipseMask = Math.max(0, visualiseIn * (1 - blackout));

      sectionMask.style.setProperty('--mask-center', \`\${maskCenter.toFixed(2)}%\`);
      sectionMask.style.setProperty('--slide-opacity', Math.max(0, slideOpacity).toFixed(4));`
);

fs.writeFileSync('src/hooks/useScene.ts', ts);
console.log('updated mask logic');
