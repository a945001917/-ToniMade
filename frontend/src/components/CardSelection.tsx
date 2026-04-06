import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import TarotCard from './TarotCard';

interface CardSelectionProps {
  onSelectionComplete: (selectedCards: number[]) => void;
}

export default function CardSelection({ onSelectionComplete }: CardSelectionProps) {
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const DECK_SIZE = 22;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --------------- DESKTOP: THE GSAP ARC LOGIC ---------------
  useEffect(() => {
    if (isMobile || !containerRef.current) return;

    const radius = window.innerWidth * 0.8; 
    const angleRange = 90;
    const startAngle = -angleRange / 2;

    gsap.set(cardsRef.current, {
      x: 0,
      y: 800, // start heavily below screen
      rotation: 0,
      opacity: 0,
      scale: 0.5,
    });

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const thetaDeg = startAngle + (angleRange / (DECK_SIZE - 1)) * i;
      const thetaRad = thetaDeg * (Math.PI / 180);
      
      const targetX = Math.sin(thetaRad) * radius;
      const targetY = radius - Math.cos(thetaRad) * radius;

      gsap.to(card, {
        x: targetX,
        y: targetY - 200, 
        rotation: thetaDeg,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.2)",
        delay: i * 0.05, 
      });
    });
  }, [isMobile]);

  // --------------- MOBILE: 3D COVER FLOW LOGIC ---------------
  const updateCoverFlow = useCallback(() => {
    if (!isMobile || !scrollContainerRef.current) return;
    const scroller = scrollContainerRef.current;
    // Calculate the exact center point of the scrolling window
    const scrollerCenter = scroller.scrollLeft + scroller.clientWidth / 2;

    cardsRef.current.forEach((card) => {
      if (!card) return;
      
      // Where is this specific card relative to the center?
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const diff = cardCenter - scrollerCenter;
      
      // Normalize progress from -1 to 1 based on half the scroller's width constraint
      const progress = Math.max(-1, Math.min(1, diff / (scroller.clientWidth * 0.6))); 
      const absProgress = Math.abs(progress);
      
      // 3D Math Magic
      const zIndex = Math.round(100 - absProgress * 100);
      const scale = Math.max(0.65, 1 - absProgress * 0.35); // Center card full size, sides shrink
      const rotateY = progress * -55; // Side cards turn inward powerfully (up to 55 degrees)
      const opacity = Math.max(0.2, 1 - absProgress * 0.8);

      card.style.transform = `perspective(800px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.zIndex = zIndex.toString();
      card.style.opacity = opacity.toString();
    });
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return;
    const scroller = scrollContainerRef.current;
    
    // Wait for the render layout, then init rotation and scroll to the center
    requestAnimationFrame(() => {
      scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2;
      updateCoverFlow();
    });

    let rAfId: number;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        rAfId = requestAnimationFrame(() => {
          updateCoverFlow();
          ticking = false;
        });
        ticking = true;
      }
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      if (rAfId) cancelAnimationFrame(rAfId);
    };
  }, [isMobile, updateCoverFlow]);

  // --------------- CARD SELECTION EVENT ---------------
  const handleCardClick = (index: number) => {
    if (selectedCards.includes(index) || selectedCards.length >= 3) return;
    
    if (isMobile && scrollContainerRef.current) {
      // In Mobile Cover Flow, auto-scroll the clicked card precisely to the center
      const clickedCard = cardsRef.current[index];
      if (clickedCard) {
        const scroller = scrollContainerRef.current;
        const cardCenter = clickedCard.offsetLeft + clickedCard.offsetWidth / 2;
        scroller.scrollTo({
          left: cardCenter - scroller.clientWidth / 2,
          behavior: 'smooth'
        });
      }
    }

    const newSelection = [...selectedCards, index];
    setSelectedCards(newSelection);
    
    if (newSelection.length === 3) {
      setTimeout(() => {
        onSelectionComplete(newSelection);
      }, 500);
    }
  };

  // --------------- RENDER (MOBILE FIRST) ---------------
  if (isMobile) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-start relative z-10 overflow-hidden pt-6">
        
        {/* Title Text */}
        <div className="w-full text-center space-y-3 z-50 pointer-events-none mt-8 sm:mt-12">
          <h2 className="text-4xl font-tarot text-amber-50 tracking-[0.2em] font-normal drop-shadow-2xl">抽取灵牌</h2>
          <p className="text-zinc-300 font-reading italic text-md drop-shadow-md">
            已选: <span className="text-amber-400 font-bold">{selectedCards.length}</span> / 3
          </p>
          <p className="text-amber-500/80 text-xs mt-2 animate-pulse uppercase tracking-[0.3em] font-reading drop-shadow-md">
            ‹ 拨动牌组 选择命运 ›
          </p>
        </div>

        {/* 3D Cover Flow Scroll Container */}
        {/* We use px-[calc(50vw-4.5rem)] to pad exact sides so the first/last card centers. Card width is 36 (9rem). Half is 4.5rem */}
        <div 
          className="w-full flex-1 max-h-[60vh] mt-8 overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex items-center justify-start [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-[calc(50vw-4.5rem)]" 
          ref={scrollContainerRef}
        >
          {Array.from({ length: DECK_SIZE }).map((_, i) => {
            const isSelected = selectedCards.includes(i);
            const selectionIndex = selectedCards.indexOf(i); // 0, 1, 2
            
            return (
              <div 
                key={i} 
                // Card size w-36 h-56 = ~144x224 px
                className={`flex-shrink-0 snap-center w-36 h-56 ease-out flex items-center justify-center relative cursor-pointer ${isSelected ? 'z-50' : 'z-10'}`}
                // Negative margins overlap the cards heavily for a realistic tight stack style 
                style={{ marginLeft: '-30px', marginRight: '-30px', transformStyle: 'preserve-3d', transition: 'opacity 0.2s, z-index 0.2s' }}
                ref={el => { cardsRef.current[i] = el; }}
                onClick={() => handleCardClick(i)}
              >
                 {isSelected && (
                    <div className="absolute -top-12 z-50 text-amber-500 font-tarot font-bold drop-shadow-[0_0_20px_rgba(245,158,11,1)] text-2xl animate-in zoom-in slide-in-from-bottom-2 duration-500 pointer-events-none">
                      {selectionIndex === 0 ? '过去' : selectionIndex === 1 ? '现在' : '未来'}
                    </div>
                  )}
                  {/* 
                      Apply translation, scaling, and perfect shadow directly to the TarotCard.
                      Since TarotCard now has rounded-xl on its root, the shadow perfectly traces the card.
                  */}
                  <TarotCard 
                    className={`transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                      isSelected 
                        ? '-translate-y-8 scale-[1.15] shadow-[0_0_40px_rgba(245,158,11,0.65)]' 
                        : 'shadow-[0_10px_20px_rgba(0,0,0,0.5)] hover:-translate-y-4 hover:scale-105'
                    }`} 
                  />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --------------- RENDER (DESKTOP ARC) ---------------
  return (
    <div className="w-full h-full flex flex-col items-center justify-start pt-20 overflow-hidden relative z-10" ref={containerRef}>
      
      {/* Title Text */}
      <div className="text-center space-y-4 absolute top-12 md:top-24 z-50 pointer-events-none">
        <h2 className="text-5xl font-tarot text-amber-50 tracking-[0.2em] font-normal drop-shadow-2xl">请抽取三张牌</h2>
        <p className="text-zinc-300 font-reading italic text-xl drop-shadow-md">
          命运的轨迹已铺开... <br/> 已选: <span className="text-amber-400 font-bold">{selectedCards.length}</span> / 3
        </p>
      </div>

      {/* The Origin Point for the Desktop Arc */}
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 h-0 w-0 flex items-center justify-center">
        {Array.from({ length: DECK_SIZE }).map((_, i) => {
          const isSelected = selectedCards.includes(i);
          const selectionIndex = selectedCards.indexOf(i); // 0, 1, 2
          
          return (
            <div 
              key={i} 
              // GSAP WRAPPER - Size matched tightly to child to prevent flexbox aspect ratio squashing
              ref={el => { cardsRef.current[i] = el; }}
              className="absolute w-36 h-60 md:w-48 md:h-80 origin-bottom"
            >
              {/* CSS INTERACTION WRAPPER */}
              <div 
                className={`w-full h-full flex-shrink-0 transition-all duration-700 ease-out flex items-center justify-center
                  ${isSelected ? '-translate-y-32 scale-125 z-50' : 'hover:-translate-y-8 hover:scale-110 z-10'}
                `}
                style={{ zIndex: isSelected ? 50 + i : i }} 
              >
                {isSelected && (
                  <div className="absolute -top-16 z-50 text-amber-500 font-tarot font-bold drop-shadow-[0_0_10px_rgba(245,158,11,1)] text-2xl animate-in zoom-in slide-in-from-bottom-2 duration-500 pointer-events-none">
                    {selectionIndex === 0 ? '过去' : selectionIndex === 1 ? '现在' : '未来'}
                  </div>
                )}
                {/* Internal TarotCard matches this size without blowing out flex container */}
                <TarotCard className={`flex-shrink-0 w-full h-full ${isSelected ? 'shadow-[0_0_50px_rgba(245,158,11,0.5)]' : ''}`} onClick={() => handleCardClick(i)} />
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}
