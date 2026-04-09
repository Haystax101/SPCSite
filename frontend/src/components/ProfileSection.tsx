export default function ProfileSection() {
  return (
    <section id="profile-section" className="scene-section" aria-label="It all starts with you">
        <div id="profile-text" className="fixed top-1/2 -translate-y-1/2 left-[5%] max-[640px]:left-1/2 max-[640px]:-translate-x-1/2 w-[45%] max-[640px]:w-[90vw] z-10 pointer-events-none flex flex-col justify-center items-start max-[640px]:items-center max-[640px]:text-center" style={{opacity: 0}}>
          <h2 className="text-[3.5rem] max-[640px]:text-[2rem] font-bold text-white tracking-tight leading-[1.1] max-[640px]:leading-[1.12] drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] mb-6 max-[640px]:mb-4">
                It all starts with you.
            </h2>
          <p className="text-[1.15rem] max-[640px]:text-[0.96rem] leading-relaxed max-[640px]:leading-snug text-gray-400 font-normal drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                Your background, goals, personality, values, and ambitions distilled into a living virtual simulation &mdash; evolving with every interaction. Not a form. A multidimensional vector, computed simultaneously against every other profile on the plane.
            </p>
        </div>
    </section>
  );
}
