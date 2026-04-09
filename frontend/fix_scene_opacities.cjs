const fs = require('fs');

let ts = fs.readFileSync('src/hooks/useScene.ts', 'utf8');

// I need to find the block I injected and wrap it in a condition, and also fix david/stats opacities.
ts = ts.replace(
  /if \(document\.getElementById\('wf-node-david'\)\) document\.getElementById\('wf-node-david'\)\.style\.opacity = bgOpacity;\n\s*if \(document\.getElementById\('wf-node-stats'\)\) document\.getElementById\('wf-node-stats'\)\.style\.opacity = bgOpacity;/,
  `const davidNode = document.getElementById('wf-node-david');
      const statsNode = document.getElementById('wf-node-stats');
      if (davidNode && scrollProgress > 1.02) davidNode.style.opacity = bgOpacity;
      if (statsNode && scrollProgress > 1.02) statsNode.style.opacity = bgOpacity;`
);

ts = ts.replace(
  /if \(michael\) \{\n\s*\/\/ Starts at 75/,
  `if (michael && scrollProgress > 1.0) {
        // Starts at 75`
);

ts = ts.replace(
  /if \(elena\) \{\n\s*\/\/ Starts at 50/,
  `if (elena && scrollProgress > 1.0) {
        // Starts at 50`
);

ts = ts.replace(
  /if \(sarah\) \{\n\s*\/\/ Starts at 25/,
  `if (sarah && scrollProgress > 1.0) {
        // Starts at 25`
);

fs.writeFileSync('src/hooks/useScene.ts', ts);
console.log('Wrapped logic in scroll bounds');
