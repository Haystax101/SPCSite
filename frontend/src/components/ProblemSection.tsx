import { scrollToVisualiseSection } from '../utils/scrollTargets';

export default function ProblemSection() {
  return (
    <div id="problem-text" className="fixed top-1/2 -translate-y-1/2 right-[5%] max-[640px]:right-auto max-[640px]:left-1/2 max-[640px]:-translate-x-1/2 w-[45%] max-[640px]:w-[90vw] z-10 pointer-events-none flex flex-col justify-center items-start max-[640px]:items-center max-[640px]:text-center" style={{opacity: 0}}>
      <h2 className="text-[3.5rem] max-[640px]:text-[2rem] font-bold text-white tracking-tight leading-[1.1] max-[640px]:leading-[1.12] drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] mb-6 max-[640px]:mb-4">
        Every life-changing connection is already out there.
      </h2>
      <p className="text-[1.15rem] max-[640px]:text-[0.96rem] leading-relaxed max-[640px]:leading-snug text-gray-400 font-normal drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] mb-10 max-[640px]:mb-5">
        The investors who would back you, the co-founders who think like you, the mentors with your exact answers -
        they exist right now. You just can't find them, reach them, or keep them.
      </p>
      <div className="pointer-events-auto">
        <button
          onClick={scrollToVisualiseSection}
          className="bg-[#111] text-white border border-white/10 font-semibold px-6 max-[640px]:px-4 py-3.5 max-[640px]:py-2.5 rounded-full text-[15px] max-[640px]:text-[13px] hover:bg-[#222] transition-colors shadow-xl focus:outline-none">
          Our solution &darr;
        </button>
      </div>
    </div>
  );
}
