export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[70vw] max-w-5xl z-50 flex items-center justify-between px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-[40px] shadow-2xl">
      <div className="text-white font-bold text-xl tracking-tight">Supercharged</div>
      <button className="bg-white text-black font-semibold px-6 py-2.5 rounded-full text-[15px] hover:bg-gray-200 transition-colors pointer-events-auto">
        Join waitlist
      </button>
    </nav>
  );
}
