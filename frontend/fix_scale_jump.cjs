const fs = require('fs');

let ts = fs.readFileSync('src/hooks/useScene.ts', 'utf8');

ts = ts.replace(
  /const targetScale = 0\.95 \+ \(0\.15 \* pInbox\);/,
  `const targetScale = 1.0 + (0.15 * pInbox);`
);

// We should also ensure the base left/top coordinates match.
// Michael natively in JSX is at top: '75%', left: '85%'
// Elena is at top: '50%', left: '85%'
// Sarah is at top: '25%', left: '85%'
// These match startTop and arcLeft math.

fs.writeFileSync('src/hooks/useScene.ts', ts);
console.log('Fixed scale jump');
