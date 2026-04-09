export default function HeroSection() {
  return (
    <div id="hero-text" className="fixed top-1/2 -translate-y-1/2 left-[5%] w-[45%] z-10">
      <div className="text-[10px] tracking-[0.15em] font-bold text-gray-400 uppercase mb-6 flex items-center gap-2">
        <span>NOW IN BETA</span>
        <span className="text-gray-600">·</span>
        <span>AI-NATIVE SOCIAL</span>
      </div>
      <h1 className="text-[4.5rem] font-bold leading-[1.05] tracking-[-0.03em] text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] mb-8">
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
      <p className="text-lg text-gray-400 leading-relaxed font-normal mb-10 max-w-[90%]">
        Surface the most valuable hidden connections at a scale no human ever could.
      </p>
      <div className="flex items-center gap-4 mb-10">
        <button className="bg-white text-black font-semibold px-6 py-3.5 rounded-full text-[15px] hover:bg-gray-200 transition-colors">
          Join waitlist
        </button>
        <button className="bg-[#111] text-white border border-white/10 font-semibold px-6 py-3.5 rounded-full text-[15px] hover:bg-[#222] transition-colors">
          See how it works &darr;
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          <div className="w-7 h-7 rounded-full border-2 border-black bg-gradient-to-br from-purple-500 to-pink-500"></div>
          <div className="w-7 h-7 rounded-full border-2 border-black bg-gradient-to-br from-pink-500 to-orange-500"></div>
          <div className="w-7 h-7 rounded-full border-2 border-black bg-gradient-to-br from-teal-400 to-blue-500"></div>
          <div className="w-7 h-7 rounded-full border-2 border-black bg-gradient-to-br from-blue-500 to-indigo-500"></div>
          <div className="w-7 h-7 rounded-full border-2 border-black bg-gradient-to-br from-green-400 to-yellow-500"></div>
        </div>
        <div className="text-[14px] text-gray-400 font-medium">
          <span className="rainbow-text font-bold italic inline-block pr-1 mr-0.5">268</span> people already supercharged
        </div>
      </div>
    </div>
  );
}
