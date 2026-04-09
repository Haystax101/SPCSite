export default function InboxSection() {
  return (
    <div id="inbox-section" style={{ opacity: 0 }} className="fixed inset-0 pointer-events-none flex flex-col justify-end pb-[10%] sm:pb-[8%] items-center transition-all z-40 bg-[#050505]">
      {/* Content Layer - Now at the bottom */}
      <div className="w-full text-center max-w-4xl px-4 sm:px-8 relative mb-2 sm:mb-4 transition-transform translate-y-4">
        <h2 className="text-[1.6rem] sm:text-[2.1rem] md:text-[2.8rem] font-bold text-white tracking-tight drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] mb-3 sm:mb-5 md:mb-6 leading-[1.1]">
          Every relationship you were ever going to lose, kept.
        </h2>
        <p className="text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] leading-relaxed text-gray-400 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] text-center mx-auto max-w-[92vw] sm:max-w-2xl px-2 sm:px-4">
          Supercharged unifies every conversation into one living stream — ranked by what matters, searchable across everything you have ever said, with every next step already handled. The relationship was always there. Now so is the infrastructure to keep it.
        </p>
      </div>
    </div>
  );
}
