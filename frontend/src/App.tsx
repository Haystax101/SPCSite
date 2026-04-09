
import { lazy, Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import VisualiseSection from './components/VisualiseSection';
import ProfileSection from './components/ProfileSection';
import './index.css';

const GraphWrapper = lazy(() => import('./components/GraphWrapper'));
const WorkflowSection = lazy(() => import('./components/WorkflowSection'));
const InboxSection = lazy(() => import('./components/InboxSection'));
const WaitlistFlow = lazy(() => import('./components/WaitlistFlow'));

function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <VisualiseSection />
      <ProfileSection />
      <Suspense fallback={null}>
        <GraphWrapper />
        <WorkflowSection />
        <InboxSection />
      </Suspense>
    </>
  );
}

function WaitlistPage() {
  const navigate = useNavigate();

  return (
    <Suspense fallback={null}>
      <WaitlistFlow isOpen onClose={() => navigate('/')} />
    </Suspense>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/waitlist" element={<WaitlistPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
