
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import VisualiseSection from './components/VisualiseSection';
import ProfileSection from './components/ProfileSection';
import WorkflowSection from './components/WorkflowSection';
import InboxSection from './components/InboxSection';
import GraphWrapper from './components/GraphWrapper';
import './index.css';

function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <VisualiseSection />
      <ProfileSection />
      <GraphWrapper />
      <WorkflowSection />
      <InboxSection />
    </>
  );
}

export default App;
