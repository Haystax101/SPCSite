import Navbar from './Navbar';

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pt-36 pb-24 sm:px-10">
        <p className="text-[11px] font-bold tracking-[0.18em] text-yellow-300 uppercase mb-4">Manifesto</p>
        <h1 className="text-[2.2rem] sm:text-[3.2rem] font-bold tracking-tight leading-[1.05] mb-6">
          100% of your time should go to people, not process.
        </h1>
        <p className="text-[1rem] sm:text-[1.15rem] text-gray-300 leading-relaxed max-w-3xl mb-5">
          Traditional professional platforms force people into search, message drafting, and follow-up management. That model is backwards.
        </p>
        <p className="text-[1rem] sm:text-[1.15rem] text-gray-300 leading-relaxed max-w-3xl mb-5">
          We believe AI should run the mechanics in the background: ranking fit, opening context-aware introductions, and maintaining momentum.
        </p>
        <p className="text-[1rem] sm:text-[1.15rem] text-gray-300 leading-relaxed max-w-3xl">
          You should spend your energy where value compounds: conversation, collaboration, trust.
        </p>
      </main>
    </div>
  );
}
