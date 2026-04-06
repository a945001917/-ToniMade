import React, { useState } from "react";
import VaporizeTextCycle from "./components/ui/vapour-text-effect";
import CardSelection from "./components/CardSelection";
import ReadingResult from "./components/ReadingResult";
import TarotCard from "./components/TarotCard";

const PROMPTS = [
  "你想问什么？",
  "说出你心中那个没能说出口的问题。",
  "此刻你心里最重要的一件事是什么？",
  "如果命运能回答你一个问题，你想问什么？",
  "你真正想知道的是什么？"
];

function App() {
  const [phase, setPhase] = useState<"input" | "selection" | "portal" | "reading">("input");
  
  // State for Input Phase
  const [question, setQuestion] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [fadePrompt, setFadePrompt] = useState(true);

  React.useEffect(() => {
    if (phase !== "input") return;
    const interval = setInterval(() => {
      setFadePrompt(false);
      setTimeout(() => {
        setPromptIndex(p => (p + 1) % PROMPTS.length);
        setFadePrompt(true);
      }, 400); // wait 400ms for fade out to complete before swapping and fading back in
    }, 2500); // 2.5s total display time
    return () => clearInterval(interval);
  }, [phase]);
  
  // State for Reading Phase
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setTransitioning(true);

    setTimeout(() => {
      setTransitioning(false);
      setPhase("selection");
    }, 4500); 
  };

  const handleSelectionComplete = (indexes: number[]) => {
    setSelectedCards(indexes);
    setPhase("portal");
    setTimeout(() => {
      setPhase("reading");
    }, 2800);
  };

  const handleReset = () => {
    setQuestion("");
    setSelectedCards([]);
    setPhase("input");
  };

  return (
    <main className="min-h-screen w-full bg-black text-white overflow-hidden relative selection:bg-white/30 font-reading">
      {/* 1. Background Layers (Pre-rendered for performance) */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80 pointer-events-none z-0"></div>
      
      {/* 2. Mystical Glow Orbs (RE-RESTORED AMBER LIGHTING) */}
      <div className="fixed -top-[20%] -left-[10%] w-[150vw] h-[150vw] md:w-[70vw] md:h-[70vw] rounded-full bg-amber-600/5 blur-[150px] pointer-events-none mix-blend-screen z-0"></div>
      <div className="fixed -bottom-[20%] -right-[10%] w-[150vw] h-[150vw] md:w-[70vw] md:h-[70vw] rounded-full bg-amber-900/10 blur-[150px] pointer-events-none mix-blend-screen z-0"></div>

      {/* 3. Infinite Sacred Geometry (Astrolabe / Tarot Back) - RE-RESTORED */}
      <div className="fixed inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none mix-blend-screen z-0">
        <svg 
          viewBox="0 0 1000 1000" 
          className="min-w-[1000px] md:min-w-0 w-[250vw] md:w-[110vw] max-w-none h-auto text-amber-500 drop-shadow-2xl animate-[spin_120s_linear_infinite]"
        >
          <g stroke="currentColor" fill="none" strokeWidth="1.5">
            {/* Outer Rings */}
            <circle cx="500" cy="500" r="480" strokeWidth="3" strokeDasharray="4 8" />
            <circle cx="500" cy="500" r="460" strokeWidth="1" />
            <circle cx="500" cy="500" r="450" strokeWidth="0.5" />
            
            {/* 8-Point Star (Intersecting Squares) */}
            <rect x="180" y="180" width="640" height="640" transform="rotate(45 500 500)" />
            <rect x="180" y="180" width="640" height="640" transform="rotate(0 500 500)" />
            
            {/* Hexagram (Intersecting Triangles) */}
            <polygon points="500,120 829,690 171,690" strokeWidth="2" />
            <polygon points="500,880 829,310 171,310" strokeWidth="2" />
            
            {/* Inner Focal Rings */}
            <circle cx="500" cy="500" r="280" strokeDasharray="12 12" />
            <circle cx="500" cy="500" r="140" />
            <circle cx="500" cy="500" r="130" strokeWidth="3" />
            
            {/* Center Eye / Seed */}
            <circle cx="500" cy="500" r="30" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
            <circle cx="500" cy="500" r="10" fill="currentColor" />
            
            {/* Divine Radiance Lines (Zodiac / Astrological Houses) */}
            {Array.from({length: 24}).map((_, i) => (
               <line key={i} x1="500" y1="40" x2="500" y2="960" transform={`rotate(${i * 15} 500 500)`} strokeDasharray="2 10" opacity="0.5"/>
            ))}
          </g>
        </svg>
      </div>
      
      {/* 4. PHASE 1: INPUT */}
      {phase === "input" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 overflow-y-auto">
          <form 
            onSubmit={handleQuestionSubmit} 
            className={`w-full max-w-2xl flex flex-col items-center space-y-12 transition-all duration-1000 my-auto py-12 ${transitioning ? 'opacity-0 scale-95 pointer-events-none' : 'animate-in fade-in zoom-in'}`}
          >
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-7xl font-tarot font-normal tracking-[0.25em] text-zinc-200">
                塔罗
              </h1>
              <p className={`text-lg md:text-xl text-zinc-400 font-reading italic tracking-wider transition-opacity duration-300 ${fadePrompt ? 'opacity-100' : 'opacity-0'}`}>
                {PROMPTS[promptIndex]}
              </p>
            </div>

            <div className="relative w-full">
              <input
                type="text"
                autoFocus
                value={question}
                maxLength={40}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 md:py-6 text-center text-xl md:text-3xl font-reading font-normal outline-none backdrop-blur-md transition-all focus:border-white/30 focus:bg-white/10 shadow-2xl shadow-black/50 text-amber-50 placeholder:text-zinc-700"
                placeholder="将你心中的问题，交给星辰…"
              />
              
              {/* Premium hints */}
              <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 text-xs md:text-sm font-reading tracking-[0.15em] text-zinc-500 w-full">
                <div className="flex items-center justify-center whitespace-nowrap">
                  <span className="text-amber-500/70 mr-3">✦ 宜</span>
                  <span className="opacity-80">探索未知 (例: 新项目我该注意什么)</span>
                </div>
                <div className="flex items-center justify-center whitespace-nowrap">
                  <span className="text-rose-900/80 mr-3">✦ 忌</span>
                  <span className="opacity-80">笃定真假 (例: 我明天会发财吗)</span>
                </div>
              </div>
            </div>

            {/* Action Area */}
            <div 
              className={`flex flex-col items-center gap-4 mt-6 transition-all duration-1000 ease-out 
                ${question.trim() && !transitioning ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`
              }
            >
              <button 
                type="submit"
                disabled={!question.trim()}
                className="group relative flex items-center justify-center gap-4 px-10 py-4 overflow-hidden rounded-full border border-amber-500/30 bg-black/40 backdrop-blur-md text-amber-50 hover:bg-amber-500/10 hover:border-amber-400/60 transition-all duration-700"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-amber-500/10 to-transparent -translate-x-full group-hover:duration-1000 group-hover:translate-x-full ease-out"></div>
                <span className="font-reading tracking-[0.4em] ml-2 text-sm relative z-10">抽取塔罗牌</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. VAPORIZING TRANSITION */}
      {transitioning && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none bg-black/40 animate-in fade-in duration-1000 fill-mode-both">
          {/* Tarot Element Background specifically for Vaporize phase */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none animate-[spin_60s_linear_infinite]">
            <svg viewBox="0 0 1000 1000" className="w-[120vw] h-[120vw] max-w-5xl text-amber-500/50 mix-blend-screen">
              <g stroke="currentColor" fill="none" strokeWidth="2">
                <circle cx="500" cy="500" r="460" strokeDasharray="10 20" />
                <polygon points="500,100 900,800 100,800" strokeWidth="1"/>
                <polygon points="500,900 900,200 100,200" strokeWidth="1"/>
                <circle cx="500" cy="500" r="280" />
                <circle cx="500" cy="500" r="260" strokeDasharray="4 8" />
              </g>
            </svg>
          </div>
          
          <div className="w-full h-screen max-w-4xl flex items-center justify-center relative z-10">
            <VaporizeTextCycle
              texts={[question]}
              font={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "PingFang SC", sans-serif',
                fontSize: window.innerWidth < 768 ? "32px" : "48px",
                fontWeight: 300,
              }}
              color="rgba(245, 158, 11, 0.95)"
              spread={12}
              density={10}
              animation={{
                startDelay: 1.5,
                vaporizeDuration: 2.2,
                fadeInDuration: 0,
                waitDuration: 0.8,
              }}
              direction="left-to-right"
              alignment="center"
            />
          </div>
        </div>
      )}

      {/* 4. PHASE 2: SELECTION (Lazy mounted for performance) */}
      {(phase === "selection" || phase === "portal") && (
        <div className="absolute inset-0 z-10 w-full flex items-center justify-center overflow-hidden">
          <CardSelection onSelectionComplete={handleSelectionComplete} />
        </div>
      )}

      {/* 5. PORTAL TRANSITION OVERLAY */}
      {phase === "portal" && (
        <div className="absolute inset-0 z-50 bg-black animate-portal-overlay-in flex flex-col items-center justify-center overflow-hidden">
          {/* Sacred geometry */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-portal-geo-spin opacity-40">
            <svg viewBox="0 0 1000 1000" className="w-[120vw] h-[120vw] max-w-4xl text-amber-500">
               <g stroke="currentColor" fill="none" strokeWidth="1">
                 <circle cx="500" cy="500" r="460" strokeDasharray="4 12" />
                 <polygon points="500,100 900,800 100,800" />
                 <polygon points="500,900 900,200 100,200" />
               </g>
            </svg>
          </div>

          {/* Cards arrival */}
          <div className="relative w-36 h-60 md:w-44 md:h-72 animate-cards-glow-out z-10">
            <div className="absolute inset-0 animate-card-arrive-left" style={{ zIndex: 1 }}>
              <TarotCard className="w-full h-full" />
            </div>
            <div className="absolute inset-0 animate-card-arrive-top" style={{ zIndex: 3 }}>
              <TarotCard className="w-full h-full" />
            </div>
            <div className="absolute inset-0 animate-card-arrive-right" style={{ zIndex: 2 }}>
              <TarotCard className="w-full h-full" />
            </div>
          </div>

          <div className="absolute bottom-[30%] text-center animate-oracle-text-reveal">
            <p className="text-amber-500 font-tarot text-2xl md:text-3xl tracking-[0.5em] drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              神谕降临
            </p>
          </div>
          <div className="absolute inset-0 bg-black pointer-events-none animate-portal-fade-to-black z-50" />
        </div>
      )}

      {/* 6. PHASE 3: READING RESULT */}
      {phase === "reading" && (
        <div className="absolute inset-0 z-10 overflow-y-auto w-full">
          <ReadingResult 
            question={question} 
            selectedIndexes={selectedCards} 
            onReset={handleReset} 
          />
        </div>
      )}

      {/* ToniMade Logo as a subtle watermark */}
      <div className="fixed top-4 left-4 md:top-6 md:left-8 z-0 opacity-15 md:opacity-30 pointer-events-none select-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" className="w-24 md:w-32 h-auto drop-shadow-sm">
          <text x="50%" y="55%" 
                dominantBaseline="middle" 
                textAnchor="middle" 
                fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif" 
                fontSize="80" 
                letterSpacing="-2.5">
            <tspan fontWeight="700" fill="#f5f5f7">Toni</tspan>
            <tspan fontWeight="300" fill="#a1a1a6">Made</tspan>
          </text>
        </svg>
      </div>
    </main>
  );
}

export default App;
