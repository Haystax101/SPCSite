import { scrollToVisualiseSection } from '../utils/scrollTargets';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div id="hero-text" className="fixed top-1/2 max-[640px]:top-[54%] -translate-y-1/2 left-[5%] max-[640px]:left-1/2 max-[640px]:-translate-x-1/2 w-[45%] max-[640px]:w-[90vw] z-10 max-[640px]:text-center">
      <div className="text-[10px] max-[640px]:text-[8px] tracking-[0.15em] font-bold text-gray-400 uppercase mb-6 max-[640px]:mb-3 flex items-center gap-2 max-[640px]:justify-center">
        <span>NOW IN BETA</span>
        <span className="text-gray-600">·</span>
        <span>AI-NATIVE SOCIAL</span>
      </div>
      <h1 className="text-[4.5rem] max-[640px]:text-[2.1rem] font-bold leading-[1.05] max-[640px]:leading-[1.08] tracking-[-0.03em] text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] mb-8 max-[640px]:mb-4">
        Connect autonomously with
        <div className="h-[1.1em] overflow-hidden inline-block align-bottom -mb-2">
          <div className="scrolling-words flex flex-col text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-500 pb-2">
            <span className="h-[1.1em] shrink-0 block">Employers</span>
            <span className="h-[1.1em] shrink-0 block">Mentors</span>
            <span className="h-[1.1em] shrink-0 block">Investors</span>
            <span className="h-[1.1em] shrink-0 block">Professionals</span>
            <span className="h-[1.1em] shrink-0 block">Co-Founders</span>
            <span className="h-[1.1em] shrink-0 block">Collaborators</span>
            <span className="h-[1.1em] shrink-0 block">Employers</span>
          </div>
        </div>
      </h1>
      <p className="text-lg max-[640px]:text-[0.95rem] text-gray-400 leading-relaxed max-[640px]:leading-snug font-normal mb-10 max-[640px]:mb-5 max-w-[90%] max-[640px]:max-w-full">
        Surface the most valuable hidden connections at a scale no human ever could.
      </p>
      <div className="flex items-center gap-4 max-[640px]:gap-2.5 max-[640px]:items-stretch max-[640px]:flex-col mb-10 max-[640px]:mb-5">
        <button type="button" onClick={() => navigate('/waitlist')} className="bg-white text-black font-semibold px-6 max-[640px]:px-4 py-3.5 max-[640px]:py-2.5 rounded-full text-[15px] max-[640px]:text-[13px] hover:bg-gray-200 transition-colors max-[640px]:w-full">
          Join waitlist
        </button>
        <button type="button" onClick={scrollToVisualiseSection} className="bg-[#111] text-white border border-white/10 font-semibold px-6 max-[640px]:px-4 py-3.5 max-[640px]:py-2.5 rounded-full text-[15px] max-[640px]:text-[13px] hover:bg-[#222] transition-colors max-[640px]:w-full">
          See how it works &darr;
        </button>
      </div>
      <div className="flex items-center gap-4 max-[640px]:gap-2.5 max-[640px]:justify-center">
        <div className="flex -space-x-2">
          <div className="w-7 h-7 max-[640px]:w-6 max-[640px]:h-6 rounded-full border-2 border-black bg-gradient-to-br from-purple-500 to-pink-500"></div>
          <div className="w-7 h-7 max-[640px]:w-6 max-[640px]:h-6 rounded-full border-2 border-black bg-gradient-to-br from-pink-500 to-orange-500"></div>
          <div className="w-7 h-7 max-[640px]:w-6 max-[640px]:h-6 rounded-full border-2 border-black bg-gradient-to-br from-teal-400 to-blue-500"></div>
          <div className="w-7 h-7 max-[640px]:w-6 max-[640px]:h-6 rounded-full border-2 border-black bg-gradient-to-br from-blue-500 to-indigo-500"></div>
          <div className="w-7 h-7 max-[640px]:w-6 max-[640px]:h-6 rounded-full border-2 border-black bg-gradient-to-br from-green-400 to-yellow-500"></div>
        </div>
        <div className="text-[14px] max-[640px]:text-[12px] text-gray-400 font-medium max-[640px]:leading-tight max-[640px]:max-w-[56vw]">
          <span className="rainbow-text font-bold italic inline-block pr-1 mr-0.5">268</span> people already supercharged
        </div>
      </div>
    </div>
  );
}
