const fs = require('fs');

// 1. VisualiseSection
let vis = fs.readFileSync('src/components/VisualiseSection.tsx', 'utf8');
vis = vis.replace(
  /<h2 className="text-4xl font-bold text-white tracking-tight uppercase">VISUALISE YOUR PROGRESS<\/h2>/,
  `<h2 className="text-5xl font-bold text-white tracking-tight drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)]">But now it does.</h2>`
);
vis = vis.replace(
  /<p className="text-lg text-gray-400 max-w-2xl mx-auto">Your social graph evolves in real-time as our social simulations reshape your topography<\/p>/,
  `<p className="text-[1.15rem] leading-relaxed text-gray-400 max-w-3xl mx-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">Supercharged autonomously finds, reaches, and maintains the connections that matter — at a scale no human could manage alone. Your entire possibility space, mapped as a living topographical plane. The people who matter most, rising to the surface automatically.</p>`
);

// We should also adjust top/bottom classes because the text is no longer just unstyled "title" and "text"
vis = vis.replace(
  /className="fixed bottom-\[10%\] left-1\/2 -translate-x-1\/2 z-10 pointer-events-none w-full text-center"/,
  `className="fixed bottom-[15%] left-1/2 -translate-x-1/2 z-10 pointer-events-none w-full text-center"`
);
vis = vis.replace(
  /className="fixed top-\[15%\] left-1\/2 -translate-x-1\/2 z-10 pointer-events-none"/,
  `className="fixed top-[20%] left-1/2 -translate-x-1/2 z-10 pointer-events-none w-full text-center"`
);
fs.writeFileSync('src/components/VisualiseSection.tsx', vis);

// 2. WorkflowSection
let wf = fs.readFileSync('src/components/WorkflowSection.tsx', 'utf8');
// Inject heading & text inside workflow section layout
const wfTextHtml = `
      {/* Workflow Text */}
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-full text-center max-w-4xl px-6 pointer-events-none z-20">
        <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] mb-4">
          Your profile is running right now.
        </h2>
        <p className="text-[1.15rem] leading-relaxed text-gray-400 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
          Every other profile on the plane is continuously computed against yours — measuring alignment across goals, personality, communication style, professional background, and values simultaneously — to surface the people most likely to change things for you.
        </p>
      </div>
`;
wf = wf.replace(
  /<svg id="workflow-lines"/,
  wfTextHtml + '\n      <svg id="workflow-lines"'
);
fs.writeFileSync('src/components/WorkflowSection.tsx', wf);
console.log('Fixed Visualise and Workflow texts!');
