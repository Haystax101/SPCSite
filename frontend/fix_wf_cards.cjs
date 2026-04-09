const fs = require('fs');

let wf = fs.readFileSync('src/components/WorkflowSection.tsx', 'utf8');

// Update Elena card to have Med Priority
wf = wf.replace(
  /<div className="flex flex-col gap-0\.5 flex-1">\n\s*<div className="text-white text-\[14px\] font-semibold tracking-tight">Elena Rostova<\/div>\n\s*<div className="text-gray-400 text-\[11px\] font-medium leading-tight">Angel Investor<\/div>\n\s*<\/div>/,
  `<div className="flex flex-col gap-0.5 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-white text-[14px] font-semibold tracking-tight">Elena Rostova</div>
            <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">HIGH</div>
          </div>
          <div className="text-gray-400 text-[11px] font-medium leading-tight">Angel Investor</div>
        </div>`
);

// Update Sarah card to have Low Priority
wf = wf.replace(
  /<div className="flex flex-col gap-0\.5 flex-1">\n\s*<div className="text-white text-\[14px\] font-semibold tracking-tight">Sarah Jenkins<\/div>\n\s*<div className="text-gray-400 text-\[11px\] font-medium leading-tight">VP of Growth<\/div>\n\s*<\/div>/,
  `<div className="flex flex-col gap-0.5 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-white text-[14px] font-semibold tracking-tight">Sarah Jenkins</div>
            <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-300">NORMAL</div>
          </div>
          <div className="text-gray-400 text-[11px] font-medium leading-tight">VP of Growth</div>
        </div>`
);

// Update Michael card to have High Priority
wf = wf.replace(
  /<div className="flex flex-col gap-0\.5 flex-1">\n\s*<div className="text-white text-\[14px\] font-semibold tracking-tight">Michael Chang<\/div>\n\s*<div className="text-gray-400 text-\[11px\] font-medium leading-tight">Technical Founder<\/div>\n\s*<\/div>/,
  `<div className="flex flex-col gap-0.5 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-white text-[14px] font-semibold tracking-tight">Michael Chang</div>
            <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">URGENT</div>
          </div>
          <div className="text-gray-400 text-[11px] font-medium leading-tight">Technical Founder</div>
        </div>`
);

// Give bg and text explicit ids so we can fade them independently
wf = wf.replace(
  /<div className="absolute inset-0" style=\{\{/,
  `<div id="wf-bg-grid" className="absolute inset-0 transition-opacity" style={{`
);
wf = wf.replace(
  /<div className="absolute top-\[12%\] left-1\/2 -translate-x-1\/2 w-full text-center max-w-4xl px-6 pointer-events-none z-20">/,
  `<div id="wf-bg-text" className="absolute top-[12%] left-1/2 -translate-x-1/2 w-full text-center max-w-4xl px-6 pointer-events-none z-20 transition-opacity">`
);

fs.writeFileSync('src/components/WorkflowSection.tsx', wf);

// Update InboxSection to position text at top rather than center, allowing room for inbox cards
let ib = fs.readFileSync('src/components/InboxSection.tsx', 'utf8');
ib = ib.replace(
  /justify-center items-center bg-\[\#050505\]"/,
  `justify-start pt-[12%] items-center bg-[#050505]"`
);
// Make the container fade in behind workflow cards! No, we don't need background in InboxSection, we can let WorkflowSection stay fixed on top, 
// and InboxSection will fade in its text.
fs.writeFileSync('src/components/InboxSection.tsx', ib);
console.log('Update WF DOM elements');
