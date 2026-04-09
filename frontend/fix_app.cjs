const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Insert import
app = app.replace(
  /import WorkflowSection from '\.\/components\/WorkflowSection';/,
  `import WorkflowSection from './components/WorkflowSection';\nimport InboxSection from './components/InboxSection';`
);

// Insert component
app = app.replace(
  /<WorkflowSection \/>/,
  `<WorkflowSection />\n      <InboxSection />`
);

fs.writeFileSync('src/App.tsx', app);
console.log('App.tsx updated');
