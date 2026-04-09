import statsImg from '../assets/stats.png';

export default function WorkflowSection() {
  return (
    <div id="workflow-section" aria-hidden="true" style={{opacity: 0}} className="fixed inset-0 bg-[#0A0A0A] z-12 pointer-events-none will-change-[opacity,transform]">
      {/* n8n-style Background Grid */}
      <div id="wf-bg-grid" className="absolute inset-0 transition-opacity" style={{
        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)',
        backgroundSize: '24px 24px',
        opacity: 0.05
      }}></div>

      
      {/* Workflow Text */}
      <div id="wf-bg-text" className="absolute top-[12%] left-1/2 -translate-x-1/2 w-full text-center max-w-4xl px-6 pointer-events-none z-20 transition-opacity">
        <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] mb-4">
          Your profile is running right now.
        </h2>
        <p className="text-[1.15rem] leading-relaxed text-gray-400 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
          Every other profile on the plane is continuously computed against yours — measuring alignment across goals, personality, communication style, professional background, and values simultaneously — to surface the people most likely to change things for you.
        </p>
      </div>

      <svg id="workflow-lines" className="absolute inset-0 w-full h-full">
        {/* SVG Bezier Curves for Nodes. */}
        <path id="path-david-stats-1" className="workflow-link stroke-yellow-400 stroke-[2] fill-none" d="M 0 0 C 0 0 0 0 0 0" />
        <path id="path-david-stats-2" className="workflow-link stroke-yellow-400 stroke-[2] fill-none" d="M 0 0 C 0 0 0 0 0 0" />
        <path id="path-david-stats-3" className="workflow-link stroke-yellow-400 stroke-[2] fill-none" d="M 0 0 C 0 0 0 0 0 0" />
        
        <path id="path-stats-elena-1" className="workflow-link stroke-yellow-400 stroke-[2] fill-none" d="M 0 0 C 0 0 0 0 0 0" />
        <path id="path-stats-elena-2" className="workflow-link stroke-yellow-400 stroke-[2] fill-none" d="M 0 0 C 0 0 0 0 0 0" />
        <path id="path-stats-elena-3" className="workflow-link stroke-yellow-400 stroke-[2] fill-none" d="M 0 0 C 0 0 0 0 0 0" />
      </svg>

      {/* Node 1: David */}
      <div id="wf-node-david" className="workflow-card absolute flex items-center gap-3 w-[310px] p-4 border border-white/10 rounded-xl bg-[#111] shadow-2xl transition-all will-change-[transform,opacity] opacity-0" style={{top: '50%', left: '19.5%', transform: 'translate(-50%, -50%) scale(0.95)'}}>
        <img src="https://i.pravatar.cc/100?img=11" alt="David Chen" className="w-12 h-12 rounded-md border border-white/20 object-cover" />
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-white text-[15px] font-semibold tracking-tight">David Chen</div>
          <div className="text-gray-400 text-[12px] font-medium leading-tight">Building FinTech at Genesis</div>
        </div>
        
        <div className="absolute right-[-6px] top-[25%] -translate-y-1/2 w-3 h-3 rounded-full bg-[#111] border-[2px] border-yellow-400"></div>
        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#111] border-[2px] border-yellow-400"></div>
        <div className="absolute right-[-6px] top-[75%] -translate-y-1/2 w-3 h-3 rounded-full bg-[#111] border-[2px] border-yellow-400"></div>
      </div>

      {/* Node 2: Stats Image */}
      <div id="wf-node-stats" className="workflow-card absolute transition-all will-change-[transform,opacity] opacity-0" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(0.95)', width: '340px'}}>
         <div className="relative w-full h-full p-2 border border-white/10 rounded-xl bg-[#111] shadow-2xl flex flex-col justify-center">
           <img src={statsImg} alt="Stats" className="w-full h-auto rounded-lg" />
           <div className="absolute left-[-6px] top-[25%] -translate-y-1/2 w-3 h-3 rounded-full bg-[#111] border-[2px] border-gray-500"></div>
           <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#111] border-[2px] border-gray-500"></div>
           <div className="absolute left-[-6px] top-[75%] -translate-y-1/2 w-3 h-3 rounded-full bg-[#111] border-[2px] border-gray-500"></div>
           
           <div className="absolute right-[-6px] top-[25%] -translate-y-1/2 w-3 h-3 rounded-full bg-[#111] border-[2px] border-yellow-400"></div>
           <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#111] border-[2px] border-yellow-400"></div>
           <div className="absolute right-[-6px] top-[75%] -translate-y-1/2 w-3 h-3 rounded-full bg-[#111] border-[2px] border-yellow-400"></div>
         </div>
      </div>

      {/* Node 3: Elena */}
      <div id="wf-node-elena" className="workflow-card absolute flex items-center gap-3 w-[260px] p-3 border border-white/10 rounded-xl bg-[#111] shadow-2xl transition-all will-change-[transform,opacity] opacity-0" style={{top: '50%', left: '85%', transform: 'translate(-50%, -50%) scale(0.95)'}}>
        <img src="https://i.pravatar.cc/100?img=47" alt="Elena Rostova" className="w-10 h-10 rounded-md border border-white/20 object-cover" />
        <div className="flex flex-col gap-0.5 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-white text-[14px] font-semibold tracking-tight">Elena Rostova</div>
            <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">HIGH</div>
          </div>
          <div className="text-gray-400 text-[11px] font-medium leading-tight">Angel Investor</div>
        </div>
        
        <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#111] border-[2px] border-gray-500"></div>
      </div>

      {/* Node 4: Sarah */}
      <div id="wf-node-sarah" className="workflow-card absolute flex items-center gap-3 w-[260px] p-3 border border-white/10 rounded-xl bg-[#111] shadow-2xl transition-all will-change-[transform,opacity] opacity-0" style={{top: '25%', left: '85%', transform: 'translate(-50%, -50%) scale(0.95)'}}>
        <img src="https://i.pravatar.cc/100?img=5" alt="Sarah Jenkins" className="w-10 h-10 rounded-md border border-white/20 object-cover" />
        <div className="flex flex-col gap-0.5 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-white text-[14px] font-semibold tracking-tight">Sarah Jenkins</div>
            <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-300">NORMAL</div>
          </div>
          <div className="text-gray-400 text-[11px] font-medium leading-tight">VP of Growth</div>
        </div>
        <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#111] border-[2px] border-gray-500"></div>
      </div>

      {/* Node 5: Michael */}
      <div id="wf-node-michael" className="workflow-card absolute flex items-center gap-3 w-[260px] p-3 border border-white/10 rounded-xl bg-[#111] shadow-2xl transition-all will-change-[transform,opacity] opacity-0" style={{top: '75%', left: '85%', transform: 'translate(-50%, -50%) scale(0.95)'}}>
        <img src="https://i.pravatar.cc/100?img=8" alt="Michael Chang" className="w-10 h-10 rounded-md border border-white/20 object-cover" />
        <div className="flex flex-col gap-0.5 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-white text-[14px] font-semibold tracking-tight">Michael Chang</div>
            <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">URGENT</div>
          </div>
          <div className="text-gray-400 text-[11px] font-medium leading-tight">Technical Founder</div>
        </div>
        <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#111] border-[2px] border-gray-500"></div>
      </div>

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
    </div>
  );
}
