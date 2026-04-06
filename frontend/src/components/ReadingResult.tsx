import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import TarotCard from './TarotCard';

interface ReadingProps {
  question: string;
  selectedIndexes: number[];
  onReset: () => void;
}

const MAJOR_ARCANA = [
  { id: 0,  name: "愚者 (The Fool)" },
  { id: 1,  name: "魔术师 (The Magician)" },
  { id: 2,  name: "女祭司 (The High Priestess)" },
  { id: 3,  name: "皇后 (The Empress)" },
  { id: 4,  name: "皇帝 (The Emperor)" },
  { id: 5,  name: "教皇 (The Hierophant)" },
  { id: 6,  name: "恋人 (The Lovers)" },
  { id: 7,  name: "战车 (The Chariot)" },
  { id: 8,  name: "力量 (Strength)" },
  { id: 9,  name: "隐士 (The Hermit)" },
  { id: 10, name: "命运之轮 (Wheel of Fortune)" },
  { id: 11, name: "正义 (Justice)" },
  { id: 12, name: "倒吊人 (The Hanged Man)" },
  { id: 13, name: "死神 (Death)" },
  { id: 14, name: "节制 (Temperance)" },
  { id: 15, name: "恶魔 (The Devil)" },
  { id: 16, name: "高塔 (The Tower)" },
  { id: 17, name: "星星 (The Star)" },
  { id: 18, name: "月亮 (The Moon)" },
  { id: 19, name: "太阳 (The Sun)" },
  { id: 20, name: "审判 (Judgement)" },
  { id: 21, name: "世界 (The World)" },
];

const FRIENDLY_ERROR = '天机不可强求，星辰此刻选择了沉默。缘分未至，不妨静候，待时机成熟，神谕自会降临。';

export default function ReadingResult({ question, selectedIndexes, onReset }: ReadingProps) {
  const [cardsFlipped, setCardsFlipped] = useState(false);
  const [aiReading, setAiReading] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [invalidInput, setInvalidInput] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const hasFetched = useRef(false);

  // Generate drawn cards once on mount
  const [drawnCards] = useState(() => {
    const safeIndexes = selectedIndexes.length === 3 ? selectedIndexes : [0, 1, 10];
    const positions = ["过去", "现在", "未来"] as const;
    return safeIndexes.map((idx, i) => {
      const card = MAJOR_ARCANA[idx];
      return {
        id: card.id,
        name: card.name,
        position: positions[i],
        orientation: (Math.random() > 0.5 ? "reversed" : "upright") as "upright" | "reversed",
        imageUrl: `/cards/${card.id}.jpg`,
      };
    });
  });

  // Auto-flip cards
  useEffect(() => {
    const t = setTimeout(() => setCardsFlipped(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // Call Gemini backend
  const fetchReading = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setInvalidInput("");
    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, drawnCards }),
      });

      let data: { reading?: string; invalid?: boolean; message?: string; error?: string } = {};
      try { data = await res.json(); } catch { /* empty body */ }

      if (!res.ok) throw new Error();
      if (data.invalid) { setInvalidInput(data.message ?? ''); return; }
      if (!data.reading) throw new Error();
      setAiReading(data.reading);
    } catch {
      setError(FRIENDLY_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [question, drawnCards]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchReading();
  }, [fetchReading]);

  const handleRetry = () => {
    hasFetched.current = false;
    fetchReading();
  };

  const handleCopy = () => {
    const cardLines = drawnCards
      .map(c => `  ${c.position}｜${c.name}${c.orientation === 'reversed' ? '（逆位）' : '（正位）'}`)
      .join('\n');

    const plainReading = aiReading
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/^---$/gm, '──────────────')
      .trim();

    const fullText =
      `✦ 塔罗神谕 · 占卜记录\n` +
      `${'─'.repeat(28)}\n\n` +
      `📍 我的提问\n「${question}」\n\n` +
      `🃏 本次抽到的三张牌\n${cardLines}\n\n` +
      `${'─'.repeat(28)}\n\n` +
      `📖 神谕解读\n\n${plainReading}\n\n` +
      `${'─'.repeat(28)}\n` +
      `本解读由 塔罗神谕 生成 · ${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}\n` +
      `Powered by ToniMade`;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };


  return (
    <div className="w-full min-h-screen py-20 px-6 z-10 flex flex-col items-center">

      {/* Header */}
      <div className="text-center space-y-4 mb-16 max-w-3xl border-b border-white/10 pb-8">
        <h2 className="text-2xl md:text-4xl font-tarot text-amber-500 tracking-[0.2em] uppercase animate-in fade-in duration-700">
          神谕已降
        </h2>
        <p className="text-zinc-300 font-reading italic text-xl md:text-2xl animate-in fade-in duration-700 delay-150">
          "{question}"
        </p>
      </div>

      {/* The 3 Cards */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-center w-full max-w-5xl mb-20">
        {drawnCards.map((card, idx) => (
          <div key={card.id} className="flex flex-col items-center space-y-6">
            <div className="text-amber-500 font-tarot tracking-[0.3em] uppercase text-sm border border-amber-500/30 px-4 py-1 rounded-full">
              {card.position}
            </div>
            <div
              className="transition-all duration-1000"
              style={{
                transitionDelay: `${idx * 300}ms`,
                opacity: cardsFlipped ? 1 : 0.8,
                transform: cardsFlipped ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              <TarotCard
                isFlipped={cardsFlipped}
                name={card.name}
                orientation={card.orientation}
                imageUrl={card.imageUrl}
              />
            </div>
            <div className={`text-zinc-300 font-reading text-lg transition-opacity duration-1000 ${cardsFlipped ? 'opacity-100' : 'opacity-0'}`}>
              {card.name} {card.orientation === 'reversed' && '(逆位)'}
            </div>
          </div>
        ))}
      </div>

      {/* AI Reading */}
      <div className={`w-full max-w-3xl bg-black/50 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-md transition-all duration-1000 delay-1000 ${cardsFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <h3 className="font-tarot text-2xl text-amber-100">解牌之引</h3>
          {!isLoading && !error && !invalidInput && aiReading && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-1.5 border border-white/10 rounded-lg text-xs font-tarot tracking-[0.15em] transition-all duration-300 hover:border-amber-500/40 hover:text-amber-300 hover:bg-amber-500/5"
              style={{ color: copied ? 'rgb(252 211 77)' : 'rgb(113 113 122)' }}
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  已复制
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  复制解读
                </>
              )}
            </button>
          )}
        </div>

        {isLoading && (
          <div className="flex flex-col items-center gap-6 py-10 text-center">
            <div className="w-10 h-10 rounded-full border-2 border-amber-500/40 border-t-amber-400 animate-spin" />
            <p className="text-zinc-500 font-reading text-sm tracking-[0.2em] animate-pulse">
              神谕正在降临，请稍候…
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-6 py-10 text-center">
            <p className="text-zinc-400 font-reading text-lg leading-relaxed">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 border border-amber-500/30 text-amber-300 font-tarot tracking-[0.2em] rounded-lg hover:bg-amber-500/10 transition-colors text-sm"
            >
              再问一次星辰
            </button>
          </div>
        )}

        {!isLoading && invalidInput && (
          <div className="flex flex-col items-center gap-8 py-10 text-center">
            <div className="text-4xl opacity-60">✦</div>
            <p className="text-zinc-300 font-reading text-lg leading-relaxed max-w-sm">{invalidInput}</p>
            <button
              onClick={onReset}
              className="px-8 py-3 border border-amber-500/40 text-amber-300 font-tarot tracking-[0.25em] rounded-lg hover:bg-amber-500/10 transition-colors"
            >
              重新输入问题
            </button>
          </div>
        )}

        {!isLoading && !error && !invalidInput && (
          <div className="space-y-4">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="font-reading text-zinc-300 text-base md:text-lg leading-relaxed">{children}</p>,
                strong: ({ children }) => <strong className="text-amber-200 font-semibold">{children}</strong>,
                hr: () => <hr className="border-white/10 my-6" />,
              }}
            >
              {aiReading}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Reset */}
      <div className={`mt-20 transition-all duration-1000 delay-[2000ms] ${cardsFlipped ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={onReset}
          className="px-8 py-3 border border-white/20 text-white font-tarot tracking-[0.2em] rounded hover:bg-white/10 transition-colors"
        >
          重新提问
        </button>
      </div>
    </div>
  );
}
