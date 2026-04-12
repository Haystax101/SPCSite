import Navbar from './Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pt-36 pb-24 sm:px-10">
        <p className="text-[11px] font-bold tracking-[0.18em] text-yellow-300 uppercase mb-4">About</p>
        <h1 className="text-[2.2rem] sm:text-[3.2rem] font-bold tracking-tight leading-[1.05] mb-6">
          Human connection should not require human admin.
        </h1>
        <p className="text-[1rem] sm:text-[1.15rem] text-gray-300 leading-relaxed max-w-3xl">
          Supercharged is an AI-native relationship platform built to remove operational overhead from networking. Tell the system who you need to meet, and it finds, evaluates, and maintains those pathways so your time goes into real conversations and real outcomes.
        </p>
      </main>
    </div>
  );
}
