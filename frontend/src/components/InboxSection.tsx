import { Link, useNavigate } from 'react-router-dom';
import { scrollToVisualiseSection } from '../utils/scrollTargets';

export default function InboxSection() {
  const navigate = useNavigate();

  return (
    <div id="inbox-section" style={{ opacity: 0 }} className="fixed top-0 left-0 w-full h-[150vh] pointer-events-none transition-all z-40 bg-[#050505]">
      <div className="h-screen flex flex-col justify-end pb-[10%] max-[640px]:pb-[12%] sm:pb-[8%] items-center">
        <div className="w-full text-center max-w-4xl px-4 max-[640px]:px-3 sm:px-8 relative mb-2 sm:mb-4 transition-transform translate-y-8">
          <h2 className="text-[1.6rem] max-[640px]:text-[1.24rem] sm:text-[2.1rem] md:text-[2.8rem] font-bold text-white tracking-tight drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] mb-3 max-[640px]:mb-2 sm:mb-5 md:mb-6 leading-[1.1]">
            Every relationship you were ever going to lose, kept.
          </h2>
          <p className="text-[0.9rem] max-[640px]:text-[0.8rem] sm:text-[1rem] md:text-[1.1rem] leading-relaxed max-[640px]:leading-snug text-gray-400 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] text-center mx-auto max-w-[92vw] sm:max-w-2xl px-2 sm:px-4">
            Supercharged unifies every conversation into one living stream — ranked by what matters, searchable across everything you have ever said, with every next step already handled. The relationship was always there. Now so is the infrastructure to keep it.
          </p>
        </div>
      </div>

      <footer id="site-footer" className="h-[50vh] w-full bg-[#060606] px-6 pb-10 pt-10 sm:px-10 lg:px-16 pointer-events-auto border-t border-white/10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2 text-white font-bold text-xl sm:text-2xl mb-6">
            <svg width="16" height="21" viewBox="0 0 12 16" fill="none" aria-hidden="true">
              <path d="M7 0L0 9h5l-1.5 7L12 7H7L7 0z" fill="#f5c842" />
            </svg>
            <span>upercharged</span>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500 mb-3">Product</p>
              <div className="flex flex-col gap-2 text-gray-200 text-[0.95rem]">
                <button type="button" onClick={scrollToVisualiseSection} className="text-left hover:text-white transition-colors">Discover</button>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
                  className="text-left hover:text-white transition-colors"
                >
                  Inbox
                </button>
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500 mb-3">Company</p>
              <div className="flex flex-col gap-2 text-gray-200 text-[0.95rem]">
                <Link to="/about" className="hover:text-white transition-colors">About</Link>
                <Link to="/manifesto" className="hover:text-white transition-colors">Manifesto</Link>
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500 mb-3">Socials</p>
              <div className="flex flex-col gap-2 text-gray-200 text-[0.95rem]">
                <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
                <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">TikTok</a>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 text-[0.82rem] text-gray-400 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Supercharged. All rights reserved.</p>
            <p>
              <a href="https://superchargedai.app/privacy" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Privacy</a>
              {' · '}
              <a href="https://superchargedai.app/terms" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Terms</a>
              {' · '}
              <a href="https://superchargedai.app/support" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Support</a>
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/waitlist')}
            className="mt-4 bg-white text-black font-semibold px-4 py-2 rounded-full text-[13px] hover:bg-gray-200 transition-colors"
          >
            Join waitlist
          </button>
        </div>
      </footer>
    </div>
  );
}
