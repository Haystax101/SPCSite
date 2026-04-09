import NodesContainer from './NodesContainer';
import useScene from '../hooks/useScene';

export default function GraphWrapper() {
  useScene();

  return (
    <div id="graph-wrapper" className="fixed z-0 overflow-hidden w-screen h-screen left-0 top-0 pointer-events-none">
        <div id="graph-container" className="absolute inset-0 w-full h-full pointer-events-auto">
            <canvas id="network-canvas" className="block w-full h-full"></canvas>
            <div id="section-mask"></div>
            <NodesContainer />
        </div>
    </div>
  );
}
