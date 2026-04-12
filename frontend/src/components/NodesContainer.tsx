import NodeCard from './NodeCard';

export default function NodesContainer() {
  return (
    <div id="nodes-container" style={{opacity: 0}} className="absolute inset-0 z-5 pointer-events-none transition-opacity duration-300">
      
      <NodeCard
        id="node-david"
        name="David Chen"
        role="Building FinTech at Genesis"
        match={98}
        avatarUrl="https://i.pravatar.cc/100?img=11"
        colorTheme="green"
        className="top-[46%] left-[45%] max-[640px]:top-[49%] max-[640px]:left-[37%]"
        defaultLarge={false}
      />

      <NodeCard
        id="node-elena"
        name="Elena Rostova"
        role="Angel Investor"
        match={72}
        avatarUrl="https://i.pravatar.cc/100?img=47"
        colorTheme="orange"
        className="top-[35%] left-[55%] max-[640px]:top-[33%] max-[640px]:left-[68%]"
      />

      <NodeCard
        id="node-marcus"
        name="Marcus Webb"
        role="SaaS Growth Researcher"
        match={24}
        avatarUrl="https://i.pravatar.cc/100?img=33"
        colorTheme="red"
        className="bottom-[34%] left-[25%] max-[640px]:bottom-[32%] max-[640px]:left-[23%]"
      />

    </div>
  );
}
