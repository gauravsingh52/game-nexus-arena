import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

const TOTAL_TARGETS = 30;
const AREA_W = 500;
const AREA_H = 400;

const AimTrainer = () => {
  const [target, setTarget] = useState<{ x: number; y: number; size: number } | null>(null);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [targetNum, setTargetNum] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [times, setTimes] = useState<number[]>([]);
  const [highScore, setHighScore] = useState(0);
  const spawnTime = useRef(0);
  const areaRef = useRef<HTMLDivElement>(null);

  const spawnTarget = useCallback((num: number) => {
    const shrink = Math.max(20, 50 - num);
    setTarget({
      x: Math.random() * (AREA_W - shrink * 2) + shrink,
      y: Math.random() * (AREA_H - shrink * 2) + shrink,
      size: shrink,
    });
    spawnTime.current = Date.now();
  }, []);

  const start = () => {
    setHits(0);
    setMisses(0);
    setTargetNum(0);
    setTimes([]);
    setGameOver(false);
    setPlaying(true);
    spawnTarget(0);
  };

  const hitTarget = () => {
    const reaction = Date.now() - spawnTime.current;
    setTimes(prev => [...prev, reaction]);
    setHits(h => h + 1);
    const next = targetNum + 1;
    setTargetNum(next);
    if (next >= TOTAL_TARGETS) {
      setPlaying(false);
      setGameOver(true);
      const finalScore = (hits + 1) * 100 - misses * 50;
      setHighScore(h => Math.max(h, finalScore));
    } else {
      spawnTarget(next);
    }
  };

  const missArea = () => {
    if (!playing) return;
    setMisses(m => m + 1);
  };

  const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;
  const finalScore = hits * 100 - misses * 50;

  return (
    <div className="min-h-screen pt-20 pb-10 flex flex-col items-center">
      <div className="container max-w-xl">
        <Link to="/games" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 font-heading">
          <ArrowLeft className="h-4 w-4" /> Back to Games
        </Link>

        <h1 className="font-display text-3xl font-bold tracking-wider mb-2">🎯 AIM TRAINER</h1>
        <div className="flex items-center gap-6 mb-6 font-display text-sm tracking-wider flex-wrap">
          <span>HITS: <span className="text-neon-green">{hits}/{TOTAL_TARGETS}</span></span>
          <span>MISSES: <span className="text-destructive">{misses}</span></span>
          <span>AVG: <span className="text-neon-purple">{avgTime}ms</span></span>
        </div>

        {/* Progress bar */}
        {playing && (
          <div className="w-full h-2 bg-muted rounded-full mb-4 overflow-hidden">
            <div className="h-full gradient-neon transition-all duration-300 rounded-full" style={{ width: `${(targetNum / TOTAL_TARGETS) * 100}%` }} />
          </div>
        )}

        <div
          ref={areaRef}
          onClick={missArea}
          className="relative rounded-2xl border-2 border-border bg-card/50 overflow-hidden cursor-crosshair mx-auto"
          style={{ width: AREA_W, height: AREA_H, maxWidth: "100%" }}
        >
          {/* Grid */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: "radial-gradient(circle, hsl(220 90% 56%) 1px, transparent 1px)",
            backgroundSize: "25px 25px",
          }} />

          {playing && target && (
            <button
              onClick={(e) => { e.stopPropagation(); hitTarget(); }}
              className="absolute rounded-full bg-neon-pink border-2 border-neon-pink/60 hover:bg-neon-pink/80 transition-all animate-scale-in cursor-pointer"
              style={{
                left: target.x - target.size / 2,
                top: target.y - target.size / 2,
                width: target.size,
                height: target.size,
              }}
            >
              <div className="absolute inset-1 rounded-full border border-white/30" />
              <div className="absolute inset-0 rounded-full animate-ping-slow border border-neon-pink/40" />
            </button>
          )}

          {!playing && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="text-center">
                <p className="font-display text-4xl mb-4">🎯</p>
                <p className="text-muted-foreground font-heading mb-4">Click {TOTAL_TARGETS} targets as fast as you can!</p>
                <Button onClick={start} className="gradient-neon glow-blue font-display tracking-wider">START</Button>
              </div>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="text-center space-y-2">
                <p className="font-display text-2xl font-bold">COMPLETE!</p>
                <p className="font-display text-lg text-neon-green">Score: {finalScore}</p>
                <p className="text-sm text-muted-foreground font-heading">Accuracy: {accuracy}% | Avg: {avgTime}ms</p>
                <p className="text-xs text-muted-foreground font-heading">High Score: {highScore}</p>
                <Button onClick={start} className="gradient-neon glow-blue font-display tracking-wider gap-2">
                  <RotateCcw className="h-4 w-4" /> RETRY
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AimTrainer;
