import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToVisualiseSection } from '../utils/scrollTargets';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToFeatures = () => {
    if (location.pathname === '/') {
      scrollToVisualiseSection();
      return;
    }

    navigate('/');
    window.setTimeout(() => {
      scrollToVisualiseSection();
    }, 60);
  };

  return (
    <nav className="fixed top-6 max-[640px]:top-3 left-1/2 -translate-x-1/2 w-[70vw] max-[640px]:w-[94vw] max-w-5xl z-50 max-[640px]:z-[220] flex items-center justify-between px-8 max-[640px]:px-4 py-4 max-[640px]:py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-[40px] max-[640px]:rounded-2xl shadow-2xl">
      <div className="text-white font-bold text-xl max-[640px]:text-[15px] tracking-tight flex items-center gap-1.5">
        <svg width="16" height="21" viewBox="0 0 12 16" fill="none" aria-hidden="true" className="shrink-0 max-[640px]:w-[11px] max-[640px]:h-[14px]">
          <path d="M7 0L0 9h5l-1.5 7L12 7H7L7 0z" fill="#f5c842" />
        </svg>
        <span>upercharged</span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-[13px] tracking-[0.12em] uppercase font-semibold text-gray-200">
        <button
          type="button"
          onClick={() => navigate('/about')}
          className="hover:text-white transition-colors"
        >
          About
        </button>
        <button
          type="button"
          onClick={goToFeatures}
          className="hover:text-white transition-colors"
        >
          Features
        </button>
        <button
          type="button"
          onClick={() => navigate('/manifesto')}
          className="hover:text-white transition-colors"
        >
          Manifesto
        </button>
      </div>
      <button type="button" onClick={() => navigate('/waitlist')} className="bg-white text-black font-semibold px-6 max-[640px]:px-4 py-2.5 max-[640px]:py-2 rounded-full text-[15px] max-[640px]:text-[12px] hover:bg-gray-200 transition-colors pointer-events-auto">
        Join waitlist
      </button>
    </nav>
  );
}
