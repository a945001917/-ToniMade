

interface TarotCardProps {
  isFlipped?: boolean;
  name?: string;
  orientation?: 'upright' | 'reversed';
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

export default function TarotCard({ 
  isFlipped = false, 
  name = "", 
  orientation = 'upright', 
  imageUrl,
  onClick,
  className = ""
}: TarotCardProps) {
  return (
    <div 
      // Added rounded-xl to ensure any shadows applied to the root match the card's shape
      className={`relative w-32 h-56 md:w-48 md:h-80 cursor-pointer rounded-xl ${className}`}
      onClick={onClick}
      style={{ perspective: '1000px' }}
    >
      <div 
        className={`w-full h-full duration-700 transition-transform ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back: Vintage Celestial Motif */}
        <div 
          className="absolute w-full h-full rounded-2xl border-4 border-amber-800/60 bg-zinc-950 shadow-2xl overflow-hidden flex items-center justify-center p-2"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Weathered Texture Overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')]" />
          
          {/* Ornate Filigree Border */}
          <div className="absolute inset-0 border-[1px] border-amber-600/40 m-2 rounded-xl" />
          <div className="absolute inset-0 border-[2px] border-amber-500/20 m-4 rounded-lg" />
          
          {/* Corner Flourish Icons */}
          {[
            'top-3 left-3',
            'top-3 right-3 rotate-90',
            'bottom-3 left-3 -rotate-90',
            'bottom-3 right-3 rotate-180'
          ].map((pos, i) => (
            <div key={i} className={`absolute w-10 h-10 text-amber-600/40 ${pos}`}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                 <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" />
               </svg>
            </div>
          ))}

          {/* Central Celestial Altar */}
          <div className="w-[85%] h-[90%] border border-amber-600/30 rounded-full flex items-center justify-center relative overflow-hidden bg-black/40">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(217,119,6,0.08)_0%,_transparent_70%)]" />
             
             {/* Sun & Moon Unity */}
             <div className="relative z-10 flex flex-col items-center">
                {/* Sun with Rays */}
                <div className="relative w-16 h-16 md:w-24 md:h-24 animate-[spin_20s_linear_infinite_reverse]">
                   <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="text-amber-500/60">
                     <circle cx="50" cy="50" r="15" />
                     {Array.from({length: 12}).map((_, i) => (
                       <line key={i} x1="50" y1="50" x2="50" y2="10" transform={`rotate(${i * 30} 500 500)`} className="origin-center" />
                     ))}
                   </svg>
                </div>
                
                {/* Mystic Eye / Center Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="w-8 h-8 rounded-full border border-amber-500/40 flex items-center justify-center p-1 bg-zinc-950">
                      <div className="w-full h-full rounded-full bg-amber-600/30 blur-[2px]" />
                   </div>
                </div>
             </div>
             
             {/* Orbital Rings */}
             <div className="absolute inset-4 border border-amber-500/10 rounded-full animate-[spin_40s_linear_infinite]" />
             <div className="absolute inset-10 border border-amber-500/5 rounded-full animate-[spin_60s_linear_infinite_reverse]" />
          </div>
        </div>

        {/* Card Front: High-End Antique Parchment */}
        <div 
          className="absolute w-full h-full rounded-2xl border-4 border-amber-600/60 bg-zinc-950 flex flex-col items-center justify-between shadow-2xl shadow-black overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)'
          }}
        >
          {imageUrl ? (
            <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden relative group">
               {/* High-Contrast Tint for "Old Master" Look */}
               <img 
                 src={imageUrl} 
                 alt={name} 
                 className={`w-full h-full object-cover sepia-[0.3] contrast-[1.1] transition-transform duration-1000 ${orientation === 'reversed' ? 'rotate-180' : ''}`}
               />
               
               {/* Heavy Victorian Vignette */}
               <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,1)] pointer-events-none" />
               
               {/* Golden Inner Frame */}
               <div className="absolute inset-3 md:inset-4 border-2 border-amber-600/30 pointer-events-none" />
               <div className="absolute inset-[14px] md:inset-[18px] border border-amber-500/10 pointer-events-none" />
               
               {/* Ancient Scroll Name Tag */}
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 min-w-[70%] text-center py-2 px-4 z-20">
                 <div className="absolute inset-0 bg-black/60 blur-md rounded-full" />
                 <span className="relative z-10 text-amber-200 font-tarot text-sm md:text-base tracking-[0.3em] uppercase mix-blend-lighten">
                   {name}
                 </span>
                 <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-1" />
               </div>
            </div>
          ) : (
            <div className="w-full h-full bg-zinc-950 p-6 flex flex-col items-center justify-center border-4 border-amber-900/40">
              <div className="text-amber-500/20 text-6xl">?</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
