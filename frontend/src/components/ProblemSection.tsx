export default function ProblemSection() {
  return (
    <div id="problem-text" className="fixed top-1/2 -translate-y-1/2 right-[5%] w-[45%] z-10 pointer-events-none flex flex-col justify-center items-start" style={{opacity: 0}}>
      <h2 className="text-[3.5rem] font-bold text-white tracking-tight leading-[1.1] drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] mb-6">
        Every life-changing connection is already out there.
      </h2>
      <p className="text-[1.15rem] leading-relaxed text-gray-400 font-normal drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] mb-10">
        The investors who would back you, the co-founders who think like you, the mentors with your exact answers —
        they exist right now. You just can't find them, reach them, or keep them.
      </p>
      <div className="pointer-events-auto">
        <button
          onClick={() => window.scrollTo({ top: ((document.body.scrollHeight - window.innerHeight) * 0.666), behavior: 'smooth' })}
          className="bg-[#111] text-white border border-white/10 font-semibold px-6 py-3.5 rounded-full text-[15px] hover:bg-[#222] transition-colors shadow-xl focus:outline-none">
          Our solution &darr;
        </button>
      </div>
    </div>
  );
}
