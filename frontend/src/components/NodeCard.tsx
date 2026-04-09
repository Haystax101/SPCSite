
interface NodeCardProps {
  id?: string;
  name: string;
  role: string;
  match?: number;
  showMatch?: boolean;
  avatarUrl: string;
  colorTheme?: 'green' | 'orange' | 'red';
  className?: string;
  defaultLarge?: boolean;
}

export default function NodeCard({
  id,
  name,
  role,
  match,
  showMatch = true,
  avatarUrl,
  colorTheme = 'green',
  className = '',
  defaultLarge = false
}: NodeCardProps) {
  
  const themeStyles = {
    green: { bg: 'bg-green-500/20', text: 'text-green-400', shadow: 'shadow-[0_0_20px_rgba(250,204,21,0.8)]', dot: 'bg-yellow-400' },
    orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', shadow: 'shadow-[0_0_12px_rgba(250,204,21,0.6)]', dot: 'bg-yellow-300' },
    red: { bg: 'bg-red-500/20', text: 'text-red-400', shadow: 'shadow-[0_0_8px_rgba(255,255,255,0.4)]', dot: 'bg-gray-200' }
  }[colorTheme];

  return (
    <div id={id} data-large={defaultLarge ? "true" : "false"} className={`absolute flex flex-col items-center group/node cursor-pointer hover:scale-105 pointer-events-auto transition-transform duration-300 ${className}`}>
      
      <div className="absolute bottom-full mb-1.5 group-data-[large=true]/node:mb-[0.8rem] group-data-[large=true]/node:translate-x-[5.5rem] -translate-y-1 opacity-100 z-10 w-max pointer-events-none transition-all duration-300">
        <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-2.5 group-data-[large=true]/node:p-3.5 shadow-2xl flex items-center gap-3 group-data-[large=true]/node:gap-4 relative transition-all duration-300">
          <img src={avatarUrl} alt="Avatar" className="w-8 h-8 group-data-[large=true]/node:w-12 group-data-[large=true]/node:h-12 rounded-full border border-gray-600 transition-all duration-300" />
          <div className="pr-1">
            <div className="text-white text-xs group-data-[large=true]/node:text-sm font-semibold transition-all duration-300">
              {name}
            </div>
            <div className="text-gray-400 text-[9px] group-data-[large=true]/node:text-[11px] mt-0.5 transition-all duration-300">
              {role}
            </div>
          </div>
          
          {showMatch && match && (
            <div className={`ml-2 group-data-[large=true]/node:ml-3 ${themeStyles.bg} ${themeStyles.text} text-[9px] group-data-[large=true]/node:text-[11px] font-bold px-2 py-1 rounded-md transition-all duration-300 group-data-[large=true]/node:hidden`}>
              {match}% Match
            </div>
          )}
        </div>
      </div>
      
      {/* Node Stem */}
      <div className="w-px h-4 group-data-[large=true]/node:h-32 bg-gradient-to-b from-white/40 to-transparent absolute bottom-1/2 group-data-[large=true]/node:bottom-[50%] origin-bottom group-data-[large=true]/node:rotate-[54deg] transition-all duration-300"></div>
      
      {/* Glowing Dot */}
      <div className={`w-2.5 h-2.5 group-data-[large=true]/node:w-4 group-data-[large=true]/node:h-4 rounded-full relative mt-2 group-data-[large=true]/node:mt-4 z-10 transition-all duration-300 ${themeStyles.dot} ${themeStyles.shadow} group-data-[large=true]/node:shadow-[0_0_20px_rgba(250,204,21,0.8)]`}>
        <div className={`absolute inset-0 rounded-full animate-ping opacity-50 block ${themeStyles.dot}`} style={{animationDuration: '1.5s'}}></div>
      </div>
      
    </div>
  );
}
