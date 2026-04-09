export default function VisualiseSection() {
  return (
    <>
      <div id="visualise-title" className="fixed top-[14%] md:top-[20%] left-1/2 -translate-x-1/2 z-10 pointer-events-none w-full text-center px-6" style={{opacity: 0}}>
        <h2 className="text-[1.8rem] sm:text-[2.4rem] md:text-5xl leading-[1.1] font-bold text-white tracking-tight drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)]">Now you can find them.</h2>
      </div>
      <div id="visualise-text" className="fixed bottom-[10%] md:bottom-[15%] left-1/2 -translate-x-1/2 z-10 pointer-events-none w-full text-center px-6" style={{opacity: 0}}>
        <p className="text-[0.92rem] sm:text-[1rem] md:text-[1.15rem] leading-relaxed text-gray-400 max-w-[92vw] sm:max-w-2xl md:max-w-3xl mx-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">Supercharged autonomously finds, reaches, and maintains the connections that matter — at a scale no human could manage alone. Your entire possibility space, mapped as a living topographical plane. The people who matter most, rising to the surface automatically.</p>
      </div>
    </>
  );
}
