export default function ProfileSection() {
  return (
    <section id="profile-section" className="scene-section" aria-label="It all starts with you">
        <div id="profile-text" className="fixed top-1/2 -translate-y-1/2 left-[5%] w-[45%] z-10 pointer-events-none flex flex-col justify-center items-start" style={{opacity: 0}}>
            <h2 className="text-[3.5rem] font-bold text-white tracking-tight leading-[1.1] drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] mb-6">
                It all starts with you.
            </h2>
            <p className="text-[1.15rem] leading-relaxed text-gray-400 font-normal drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                Your background, goals, personality, values, and ambitions distilled into a living virtual simulation &mdash; evolving with every interaction. Not a form. A multidimensional vector, computed simultaneously against every other profile on the plane.
            </p>
        </div>
    </section>
  );
}
