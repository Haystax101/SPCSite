const fs = require('fs');

let content = fs.readFileSync('src/hooks/useScene.ts', 'utf8');
content = content.replace(
  '        if (nodeDavid) {\n          const startLeft = 35;\n          const endLeft = 72;',
  '        if (nodeDavid) {\n          const startLeft = 45;\n          const endLeft = 19.5;'
);
fs.writeFileSync('src/hooks/useScene.ts', content);

let nodes = fs.readFileSync('src/components/NodesContainer.tsx', 'utf8');

// Replace David's size and position
nodes = nodes.replace(
  'absolute top-[46%] left-[35%]',
  'absolute top-[46%] left-[45%] scale-125 origin-bottom-left'
);

fs.writeFileSync('src/components/NodesContainer.tsx', nodes);

console.log('Fixed David sizing and pos');
