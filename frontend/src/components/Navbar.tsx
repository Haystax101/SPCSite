import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-6 max-[640px]:top-3 left-1/2 -translate-x-1/2 w-[70vw] max-[640px]:w-[94vw] max-w-5xl z-50 flex items-center justify-between px-8 max-[640px]:px-4 py-4 max-[640px]:py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-[40px] max-[640px]:rounded-2xl shadow-2xl">
      <div className="text-white font-bold text-xl max-[640px]:text-[15px] tracking-tight">Supercharged</div>
      <button type="button" onClick={() => navigate('/waitlist')} className="bg-white text-black font-semibold px-6 max-[640px]:px-4 py-2.5 max-[640px]:py-2 rounded-full text-[15px] max-[640px]:text-[12px] hover:bg-gray-200 transition-colors pointer-events-auto">
        Join waitlist
      </button>
    </nav>
  );
}
