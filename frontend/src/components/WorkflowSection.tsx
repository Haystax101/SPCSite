import statsImg from '../assets/stats.png';

export default function WorkflowSection() {
  return (
    <div id="workflow-section" aria-hidden="true" style={{ opacity: 0 }} className="fixed inset-0 pointer-events-none will-change-[opacity,transform] z-[100]">
      {/* Background Fill - shifted to its own ID for scroll-based fading */}
      <div id="wf-bg-fill" className="absolute inset-0 bg-[#0A0A0A] z-0"></div>

      {/* n8n-style Background Grid */}
      <div id="wf-bg-grid" className="absolute inset-0 transition-opacity z-5" style={{
        backgroundImage: 'radial-gradient(#333333 1px, transparent 0)',
        backgroundSize: '24px 24px',
        opacity: 0.1
      }}></div>

      {/* Physical Inbox Graphic (Tray) - Migrated here to stay in the same stacking context as nodes */}
      <div id="physical-inbox" className="absolute top-[42%] max-[1140px]:top-[46%] max-[640px]:top-[51%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[320px] max-[1140px]:w-[360px] max-[1140px]:h-[245px] max-[640px]:w-[268px] max-[640px]:h-[188px] pointer-events-none opacity-0 transition-opacity z-10">
        {/* Back Plane of the Tray */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/[0.05] border border-white/20 rounded-[2rem] max-[1140px]:rounded-[1.5rem] max-[640px]:rounded-[1.2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-25">
          {/* Inner side lighting */}
          <div className="absolute inset-x-4 top-4 bottom-12 max-[1140px]:inset-x-3 max-[1140px]:top-3 max-[1140px]:bottom-10 border-l border-t border-white/10 rounded-tl-xl opacity-50"></div>
        </div>

        {/* Front Rim Overlay (Cards slide behind this) */}
        <div className="absolute bottom-0 left-0 right-0 h-28 max-[1140px]:h-24 max-[640px]:h-20 bg-gradient-to-t from-white/20 to-white/5 border-t border-white/30 rounded-b-[2rem] max-[1140px]:rounded-b-[1.5rem] max-[640px]:rounded-b-[1.2rem] z-35 flex items-end justify-center pb-6 max-[1140px]:pb-5 max-[640px]:pb-4">
          <div className="w-12 max-[640px]:w-10 h-1 bg-white/40 rounded-full mb-2 max-[640px]:mb-1.5 shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>
        </div>

        {/* Subtle glow underneath the tray */}
        <div className="absolute -bottom-10 max-[640px]:-bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-24 max-[1140px]:h-20 max-[640px]:h-16 bg-yellow-500/20 blur-[70px] max-[640px]:blur-[55px] rounded-full z-21 opacity-60"></div>
      </div>


      {/* Workflow Text */}
      <div id="wf-bg-text" className="absolute top-[12%] max-[1140px]:top-[9%] max-[640px]:top-[8.5%] left-1/2 -translate-x-1/2 w-full text-center max-w-4xl px-6 max-[1140px]:px-4 max-[640px]:px-3 pointer-events-none z-20 transition-opacity">
        <h2 className="text-[2.8rem] max-[1140px]:text-[1.9rem] max-[640px]:text-[1.22rem] font-bold text-white tracking-tight drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] mb-4 max-[1140px]:mb-3 max-[640px]:mb-1.5 leading-[1.1]">
          You already know how the conversation ends. 
        </h2>
        <p className="text-[1.1rem] max-[1140px]:text-[0.98rem] max-[640px]:text-[0.76rem] leading-relaxed max-[640px]:leading-snug text-gray-400 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] text-center max-w-2xl max-[1140px]:max-w-[92vw] max-[640px]:max-w-[94vw] mx-auto">
          Before you send a word, Supercharged has already run it. Every potential connection returns a narrative — how that conversation would actually unfold, where it would go, whether something real is there. And two scores. Your outreach success rate. Your click score. You don't reach out hoping. You reach out knowing.
        </p>
      </div>

      <svg id="workflow-lines" className="absolute inset-0 w-full h-full z-15">
        {/* SVG Bezier Curves for Nodes. */}
        <path id="path-david-stats-1" className="workflow-link stroke-yellow-400 stroke-[2] fill-none" d="M 0 0 C 0 0 0 0 0 0" />
        <path id="path-david-stats-2" className="workflow-link stroke-yellow-400 stroke-[2] fill-none" d="M 0 0 C 0 0 0 0 0 0" />
        <path id="path-david-stats-3" className="workflow-link stroke-yellow-400 stroke-[2] fill-none" d="M 0 0 C 0 0 0 0 0 0" />

        <path id="path-stats-elena-1" className="workflow-link stroke-yellow-400 stroke-[2] fill-none" d="M 0 0 C 0 0 0 0 0 0" />
        <path id="path-stats-elena-2" className="workflow-link stroke-yellow-400 stroke-[2] fill-none" d="M 0 0 C 0 0 0 0 0 0" />
        <path id="path-stats-elena-3" className="workflow-link stroke-yellow-400 stroke-[2] fill-none" d="M 0 0 C 0 0 0 0 0 0" />
      </svg>

      {/* Node 1: David */}
      <div id="wf-node-david" className="workflow-card absolute flex items-center gap-3 max-[1140px]:gap-2.5 max-[640px]:gap-1.5 w-[310px] max-[1140px]:w-[230px] max-[640px]:w-[150px] p-4 max-[1140px]:p-3 max-[640px]:p-2 border border-white/10 rounded-xl max-[640px]:rounded-lg bg-[#111] shadow-2xl transition-all will-change-[transform,opacity] opacity-0 z-30" style={{ top: '66%', left: '19.5%', transform: 'translate(-50%, -50%) scale(0.95)' }}>
        <img src="https://i.pravatar.cc/100?img=11" alt="David Chen" className="w-12 h-12 max-[1140px]:w-10 max-[1140px]:h-10 max-[640px]:w-8 max-[640px]:h-8 rounded-md border border-white/20 object-cover" />
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-white text-[15px] max-[1140px]:text-[13px] max-[640px]:text-[12px] font-semibold tracking-tight">David Chen</div>
          <div className="text-gray-400 text-[12px] max-[1140px]:text-[11px] max-[640px]:text-[10px] font-medium leading-tight">Building FinTech at Genesis</div>
        </div>
        <div className="absolute right-[-6px] max-[640px]:right-[-5px] top-[25%] -translate-y-1/2 max-[1140px]:right-auto max-[1140px]:left-[40%] max-[1140px]:top-auto max-[1140px]:bottom-[-6px] max-[1140px]:-translate-y-0 max-[1140px]:-translate-x-1/2 max-[640px]:bottom-[-5px] w-3 h-3 max-[640px]:w-2.5 max-[640px]:h-2.5 rounded-full bg-[#111] border-[2px] max-[640px]:border-[1.5px] border-yellow-400"></div>
        <div className="absolute right-[-6px] max-[640px]:right-[-5px] top-1/2 -translate-y-1/2 max-[1140px]:right-auto max-[1140px]:left-1/2 max-[1140px]:top-auto max-[1140px]:bottom-[-6px] max-[1140px]:-translate-y-0 max-[1140px]:-translate-x-1/2 max-[640px]:bottom-[-5px] w-3 h-3 max-[640px]:w-2.5 max-[640px]:h-2.5 rounded-full bg-[#111] border-[2px] max-[640px]:border-[1.5px] border-yellow-400"></div>
        <div className="absolute right-[-6px] max-[640px]:right-[-5px] top-[75%] -translate-y-1/2 max-[1140px]:right-auto max-[1140px]:left-[60%] max-[1140px]:top-auto max-[1140px]:bottom-[-6px] max-[1140px]:-translate-y-0 max-[1140px]:-translate-x-1/2 max-[640px]:bottom-[-5px] w-3 h-3 max-[640px]:w-2.5 max-[640px]:h-2.5 rounded-full bg-[#111] border-[2px] max-[640px]:border-[1.5px] border-yellow-400"></div>
      </div>

      {/* Node 2: Stats Image */}
      <div id="wf-node-stats" className="workflow-card absolute transition-all will-change-[transform,opacity] opacity-0 z-30 w-[340px] max-[1140px]:w-[260px] max-[640px]:w-[182px]" style={{ top: '66%', left: '50%', transform: 'translate(-50%, -50%) scale(0.95)' }}>
        <div className="relative w-full h-full p-2 max-[640px]:p-1.5 border border-white/10 rounded-xl max-[640px]:rounded-lg bg-[#111] shadow-2xl flex flex-col justify-center">
          <img src={statsImg} alt="Stats" className="w-full h-auto rounded-lg" />
          <div className="absolute left-[-6px] max-[640px]:left-[-5px] top-[25%] -translate-y-1/2 max-[1140px]:left-[40%] max-[1140px]:top-[-6px] max-[1140px]:-translate-x-1/2 max-[1140px]:-translate-y-0 max-[640px]:top-[-5px] w-3 h-3 max-[640px]:w-2.5 max-[640px]:h-2.5 rounded-full bg-[#111] border-[2px] max-[640px]:border-[1.5px] border-gray-500"></div>
          <div className="absolute left-[-6px] max-[640px]:left-[-5px] top-1/2 -translate-y-1/2 max-[1140px]:left-1/2 max-[1140px]:top-[-6px] max-[1140px]:-translate-x-1/2 max-[1140px]:-translate-y-0 max-[640px]:top-[-5px] w-3 h-3 max-[640px]:w-2.5 max-[640px]:h-2.5 rounded-full bg-[#111] border-[2px] max-[640px]:border-[1.5px] border-gray-500"></div>
          <div className="absolute left-[-6px] max-[640px]:left-[-5px] top-[75%] -translate-y-1/2 max-[1140px]:left-[60%] max-[1140px]:top-[-6px] max-[1140px]:-translate-x-1/2 max-[1140px]:-translate-y-0 max-[640px]:top-[-5px] w-3 h-3 max-[640px]:w-2.5 max-[640px]:h-2.5 rounded-full bg-[#111] border-[2px] max-[640px]:border-[1.5px] border-gray-500"></div>

          <div className="absolute right-[-6px] max-[640px]:right-[-5px] top-[25%] -translate-y-1/2 max-[1140px]:right-auto max-[1140px]:left-[40%] max-[1140px]:top-auto max-[1140px]:bottom-[-6px] max-[1140px]:-translate-y-0 max-[1140px]:-translate-x-1/2 max-[640px]:bottom-[-5px] w-3 h-3 max-[640px]:w-2.5 max-[640px]:h-2.5 rounded-full bg-[#111] border-[2px] max-[640px]:border-[1.5px] border-yellow-400"></div>
          <div className="absolute right-[-6px] max-[640px]:right-[-5px] top-1/2 -translate-y-1/2 max-[1140px]:right-auto max-[1140px]:left-1/2 max-[1140px]:top-auto max-[1140px]:bottom-[-6px] max-[1140px]:-translate-y-0 max-[1140px]:-translate-x-1/2 max-[640px]:bottom-[-5px] w-3 h-3 max-[640px]:w-2.5 max-[640px]:h-2.5 rounded-full bg-[#111] border-[2px] max-[640px]:border-[1.5px] border-yellow-400"></div>
          <div className="absolute right-[-6px] max-[640px]:right-[-5px] top-[75%] -translate-y-1/2 max-[1140px]:right-auto max-[1140px]:left-[60%] max-[1140px]:top-auto max-[1140px]:bottom-[-6px] max-[1140px]:-translate-y-0 max-[1140px]:-translate-x-1/2 max-[640px]:bottom-[-5px] w-3 h-3 max-[640px]:w-2.5 max-[640px]:h-2.5 rounded-full bg-[#111] border-[2px] max-[640px]:border-[1.5px] border-yellow-400"></div>
        </div>
      </div>

      {/* Node 3: Elena */}
      <div id="wf-node-elena" className="workflow-card absolute flex items-center gap-3 max-[1140px]:gap-2.5 max-[640px]:gap-1.5 w-[260px] max-[1140px]:w-[195px] max-[640px]:w-[142px] p-3 max-[1140px]:p-2.5 max-[640px]:p-1.5 border border-white/10 rounded-xl max-[640px]:rounded-lg bg-[#111] shadow-2xl transition-all will-change-[transform,opacity] opacity-0 z-30" style={{ top: '66%', left: '85%', transform: 'translate(-50%, -50%) scale(0.95)' }}>
        <img src="https://i.pravatar.cc/100?img=47" alt="Elena Rostova" className="w-10 h-10 max-[1140px]:w-9 max-[1140px]:h-9 max-[640px]:w-7 max-[640px]:h-7 rounded-md border border-white/20 object-cover" />
        <div className="flex flex-col gap-0.5 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-white text-[14px] max-[1140px]:text-[12px] max-[640px]:text-[11px] font-semibold tracking-tight">Elena Rostova</div>
            <div id="priority-tag-elena" className="text-[9px] max-[640px]:text-[8px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 opacity-0 transition-opacity duration-500">HIGH</div>
          </div>
          <div className="text-gray-400 text-[11px] max-[1140px]:text-[10px] max-[640px]:text-[9px] font-medium leading-tight">Angel Investor</div>
        </div>
        <div id="wf-dot-elena" className="absolute left-[-6px] max-[640px]:left-[-5px] top-1/2 -translate-y-1/2 max-[1140px]:left-1/2 max-[1140px]:top-[-6px] max-[1140px]:-translate-x-1/2 max-[1140px]:-translate-y-0 max-[640px]:top-[-5px] w-3 h-3 max-[640px]:w-2.5 max-[640px]:h-2.5 rounded-full bg-[#111] border-[2px] max-[640px]:border-[1.5px] border-gray-500"></div>
      </div>

      {/* Node 4: Sarah */}
      <div id="wf-node-sarah" className="workflow-card absolute flex items-center gap-3 max-[1140px]:gap-2.5 max-[640px]:gap-1.5 w-[260px] max-[1140px]:w-[195px] max-[640px]:w-[142px] p-3 max-[1140px]:p-2.5 max-[640px]:p-1.5 border border-white/10 rounded-xl max-[640px]:rounded-lg bg-[#111] shadow-2xl transition-all will-change-[transform,opacity] opacity-0 z-30" style={{ top: '42%', left: '85%', transform: 'translate(-50%, -50%) scale(0.95)' }}>
        <img src="https://i.pravatar.cc/100?img=5" alt="Sarah Jenkins" className="w-10 h-10 max-[1140px]:w-9 max-[1140px]:h-9 max-[640px]:w-7 max-[640px]:h-7 rounded-md border border-white/20 object-cover" />
        <div className="flex flex-col gap-0.5 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-white text-[14px] max-[1140px]:text-[12px] max-[640px]:text-[11px] font-semibold tracking-tight">Sarah Jenkins</div>
            <div id="priority-tag-sarah" className="text-[9px] max-[640px]:text-[8px] font-bold px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-300 opacity-0 transition-opacity duration-500">NORMAL</div>
          </div>
          <div className="text-gray-400 text-[11px] max-[1140px]:text-[10px] max-[640px]:text-[9px] font-medium leading-tight">VP of Growth</div>
        </div>
        <div id="wf-dot-sarah" className="absolute left-[-6px] max-[640px]:left-[-5px] top-1/2 -translate-y-1/2 max-[1140px]:left-1/2 max-[1140px]:top-[-6px] max-[1140px]:-translate-x-1/2 max-[1140px]:-translate-y-0 max-[640px]:top-[-5px] w-3 h-3 max-[640px]:w-2.5 max-[640px]:h-2.5 rounded-full bg-[#111] border-[2px] max-[640px]:border-[1.5px] border-gray-500"></div>
      </div>

      {/* Node 5: Michael */}
      <div id="wf-node-michael" className="workflow-card absolute flex items-center gap-3 max-[1140px]:gap-2.5 max-[640px]:gap-1.5 w-[260px] max-[1140px]:w-[195px] max-[640px]:w-[142px] p-3 max-[1140px]:p-2.5 max-[640px]:p-1.5 border border-white/10 rounded-xl max-[640px]:rounded-lg bg-[#111] shadow-2xl transition-all will-change-[transform,opacity] opacity-0 z-30" style={{ top: '90%', left: '85%', transform: 'translate(-50%, -50%) scale(0.95)' }}>
        <img src="https://i.pravatar.cc/100?img=8" alt="Michael Chang" className="w-10 h-10 max-[1140px]:w-9 max-[1140px]:h-9 max-[640px]:w-7 max-[640px]:h-7 rounded-md border border-white/20 object-cover" />
        <div className="flex flex-col gap-0.5 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-white text-[14px] max-[1140px]:text-[12px] max-[640px]:text-[11px] font-semibold tracking-tight">Michael Chang</div>
            <div id="priority-tag-michael" className="text-[9px] max-[640px]:text-[8px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 opacity-0 transition-opacity duration-500">URGENT</div>
          </div>
          <div className="text-gray-400 text-[11px] max-[1140px]:text-[10px] max-[640px]:text-[9px] font-medium leading-tight">Technical Founder</div>
        </div>
        <div id="wf-dot-michael" className="absolute left-[-6px] max-[640px]:left-[-5px] top-1/2 -translate-y-1/2 max-[1140px]:left-1/2 max-[1140px]:top-[-6px] max-[1140px]:-translate-x-1/2 max-[1140px]:-translate-y-0 max-[640px]:top-[-5px] w-3 h-3 max-[640px]:w-2.5 max-[640px]:h-2.5 rounded-full bg-[#111] border-[2px] max-[640px]:border-[1.5px] border-gray-500"></div>
      </div>
    </div>
  );
}
