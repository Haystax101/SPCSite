const fs = require('fs');
let file = fs.readFileSync('src/components/NodesContainer.tsx', 'utf8');

// The block we want to replace
const targetStr = `
        <div id="node-david" className="absolute top-[46%] left-[45%] flex flex-col items-center group/node cursor-pointer hover:scale-105 pointer-events-auto">
          <div className="absolute bottom-full mb-[0.5rem] translate-x-[4.5rem] opacity-100 z-10 w-max pointer-events-none">
            <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-2.5 shadow-2xl flex items-center gap-3 relative">
              <img src="https://i.pravatar.cc/100?img=11" alt="Avatar" className="w-8 h-8 rounded-full border border-gray-600" />
              <div className="pr-1">
                <div className="text-white text-xs font-semibold">David Chen</div>
                <div className="text-gray-400 text-[9px] mt-0.5">Building FinTech at Genesis</div>
              </div>
              <div className="ml-2 bg-green-500/20 text-green-400 text-[9px] font-bold px-2 py-1 rounded-md">98% Match</div>
            </div>
          </div>
          <div className="w-px h-24 bg-gradient-to-b from-white/40 to-transparent absolute bottom-[50%] origin-bottom rotate-[54deg]"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.8)] relative mt-3 z-10">
            <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-50 block"></div>
          </div>
        </div>`.trim();

const newStr = `
        <div id="node-david" className="absolute top-[46%] left-[45%] flex flex-col items-center group/node cursor-pointer hover:scale-105 pointer-events-auto">
          <div className="absolute bottom-full mb-[0.8rem] translate-x-[5.5rem] opacity-100 z-10 w-max pointer-events-none">
            <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-3.5 shadow-2xl flex items-center gap-4 relative">
              <img src="https://i.pravatar.cc/100?img=11" alt="Avatar" className="w-12 h-12 rounded-full border-[1.5px] border-gray-500" />
              <div className="pr-2">
                <div className="text-white text-sm font-bold">David Chen</div>
                <div className="text-gray-400 text-[11px] mt-1">Building FinTech at Genesis</div>
              </div>
              <div className="ml-3 bg-green-500/20 text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-md">98% Match</div>
            </div>
          </div>
          <div className="w-px h-32 bg-gradient-to-b from-white/40 to-transparent absolute bottom-[60%] origin-bottom rotate-[54deg]"></div>
          <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.9)] relative mt-4 z-10">
            <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-50 block"></div>
          </div>
        </div>`.trim();

file = file.replace(targetStr, newStr);

if (!file.includes('w-12 h-12 rounded-full')) {
  console.log("Replacement failed! targetStr not found.");
} else {
  fs.writeFileSync('src/components/NodesContainer.tsx', file);
  console.log("Updated David sizing.")
}

