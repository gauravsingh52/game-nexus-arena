import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useScoreSaver } from "@/hooks/useScoreSaver";

const GAME_TIME = 30;
const GRID_SIZE = 9;

const WhackAMole = () => {
  const [moles, setMoles] = useState<boolean[]>(Array(GRID_SIZE).fill(false));
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [hitEffect, setHitEffect] = useState<number | null>(null);
  const [totalWhacks, setTotalWhacks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const moleTimers = useRef<number[]>([]);
  const { saveScore, resetSaver } = useScoreSaver();

  const clearMoleTimers = () => {
    moleTimers.current.forEach(t => clearTimeout(t));
    moleTimers.current = [];
  };

  const spawnMole = useCallback(() => {
    if (!playing) return;
    const idx = Math.floor(Math.random() * GRID_SIZE);
    setMoles(prev => { const n = [...prev]; n[idx] = true; return n; });
    const hideDelay = Math.max(400, 1200 - score * 15);
    const t = window.setTimeout(() => {
      setMoles(prev => { const n = [...prev]; n[idx] = false; return n; });
    }, hideDelay);
    moleTimers.current.push(t);
  }, [playing, score]);

  useEffect(() => {
    if (!playing) return;
    const spawnRate = Math.max(300, 800 - score * 10);
    const interval = setInterval(spawnMole, spawnRate);
    return () => clearInterval(interval);
  }, [playing, spawnMole, score]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPlaying(false);
          setGameOver(true);
          setHighScore(h => Math.max(h, score));
          clearMoleTimers();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, score]);

  useEffect(() => {
    if (gameOver && score > 0) {
      const acc = totalClicks > 0 ? totalWhacks / totalClicks : 0;
      saveScore({ gameSlug: "whack-a-mole", score, accuracy: acc });
    }
  }, [gameOver]);

  const whack = (idx: number) => {
    if (!moles[idx] || !playing) return;
    setMoles(prev => { const n = [...prev]; n[idx] = false; return n; });
    const newCombo = combo + 1;
    const bonus = Math.floor(newCombo / 3) * 5;
    setScore(s => s + 10 + bonus);
    setCombo(newCombo);
    setBestCombo(b => Math.max(b, newCombo));
    setTotalWhacks(w => w + 1);
    setTotalClicks(c => c + 1);
    setHitEffect(idx);
    setTimeout(() => setHitEffect(null), 200);
  };

  const missClick = (idx: number) => {
    if (moles[idx] || !playing) return;
    setCombo(0);
    setTotalClicks(c => c + 1);
  };

  const start = () => {
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setTimeLeft(GAME_TIME);
    setMoles(Array(GRID_SIZE).fill(false));
    setGameOver(false);
    setPlaying(true);
    setTotalWhacks(0);
    setTotalClicks(0);
    clearMoleTimers();
    resetSaver();
  };

  return (
    <div className="min-h-screen pt-20 pb-10 flex flex-col items-center">
      <div className="container max-w-lg">
        <Link to="/games" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 font-heading">
          <ArrowLeft className="h-4 w-4" /> Back to Games
        </Link>

        <h1 className="font-display text-3xl font-bold tracking-wider mb-2">🔨 WHACK-A-MOLE</h1>
        <div className="flex items-center gap-6 mb-6 font-display text-sm tracking-wider">
          <span>SCORE: <span className="text-neon-green">{score}</span></span>
          <span>COMBO: <span className="text-neon-orange">x{combo}</span></span>
          <span>TIME: <span className={timeLeft <= 5 ? "text-destructive animate-pulse" : "text-primary"}>{timeLeft}s</span></span>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          {moles.map((active, i) => (
            <button
              key={i}
              onClick={() => active ? whack(i) : missClick(i)}
              className={`relative aspect-square rounded-2xl border-2 transition-all duration-150 flex items-center justify-center text-4xl select-none
                ${active ? "border-neon-orange bg-neon-orange/10 scale-105 cursor-pointer" : "border-border bg-card/50 cursor-default"}
                ${hitEffect === i ? "bg-neon-green/20 border-neon-green scale-95" : ""}
              `}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-900/30 to-amber-950/60 ${active ? "opacity-100" : "opacity-40"}`} />
              <span className={`relative z-10 transition-all duration-100 ${active ? "scale-110" : "scale-0 opacity-0"}`}>
                🐹
              </span>
              {!active && <div className="absolute w-12 h-3 bg-muted/30 rounded-full bottom-3" />}
            </button>
          ))}
        </div>

        {!playing && !gameOver && (
          <div className="text-center mt-8">
            <Button onClick={start} className="gradient-neon glow-blue font-display tracking-wider px-10">START GAME</Button>
          </div>
        )}
        {gameOver && (
          <div className="text-center mt-8 space-y-3">
            <p className="font-display text-2xl font-bold">GAME OVER!</p>
            <p className="font-display text-lg text-neon-green">Score: {score}</p>
            <p className="text-sm text-muted-foreground font-heading">Best Combo: x{bestCombo} | High Score: {highScore}</p>
            <Button onClick={start} className="gradient-neon glow-blue font-display tracking-wider gap-2">
              <RotateCcw className="h-4 w-4" /> PLAY AGAIN
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhackAMole;
