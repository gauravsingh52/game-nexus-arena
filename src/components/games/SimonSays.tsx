import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScoreSaver } from "@/hooks/useScoreSaver";
import { useAuth } from "@/hooks/useAuth";

const COLORS = ["red", "green", "blue", "yellow"] as const;
const COLOR_MAP: Record<string, string> = {
  red: "bg-red-500",
  green: "bg-emerald-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-400",
};
const COLOR_ACTIVE: Record<string, string> = {
  red: "bg-red-300 shadow-[0_0_30px_rgba(239,68,68,0.7)]",
  green: "bg-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.7)]",
  blue: "bg-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.7)]",
  yellow: "bg-yellow-200 shadow-[0_0_30px_rgba(250,204,21,0.7)]",
};

const SimonSays = () => {
  const { user } = useAuth();
  const { saveScore, resetSaver } = useScoreSaver();
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"idle" | "showing" | "input">("idle");
  const timeoutRef = useRef<number[]>([]);

  const clearTimeouts = () => {
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  };

  const playSequence = useCallback((seq: string[]) => {
    setPhase("showing");
    clearTimeouts();
    seq.forEach((color, i) => {
      const t1 = window.setTimeout(() => setActiveColor(color), i * 600);
      const t2 = window.setTimeout(() => setActiveColor(null), i * 600 + 400);
      timeoutRef.current.push(t1, t2);
    });
    const t3 = window.setTimeout(() => {
      setPhase("input");
      setPlayerInput([]);
    }, seq.length * 600 + 200);
    timeoutRef.current.push(t3);
  }, []);

  const startGame = () => {
    clearTimeouts();
    resetSaver();
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    const first = [COLORS[Math.floor(Math.random() * 4)]];
    setSequence(first);
    setTimeout(() => playSequence(first), 500);
  };

  const handlePress = (color: string) => {
    if (phase !== "input") return;
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 200);

    const newInput = [...playerInput, color];
    setPlayerInput(newInput);

    const idx = newInput.length - 1;
    if (newInput[idx] !== sequence[idx]) {
      setGameOver(true);
      setIsPlaying(false);
      setPhase("idle");
      clearTimeouts();
      return;
    }

    if (newInput.length === sequence.length) {
      const newScore = sequence.length;
      setScore(newScore);
      const next = [...sequence, COLORS[Math.floor(Math.random() * 4)]];
      setSequence(next);
      setTimeout(() => playSequence(next), 1000);
    }
  };

  useEffect(() => {
    if (gameOver && score > 0 && user) {
      saveScore({ gameSlug: "simon-says", score: score * 10 });
    }
  }, [gameOver]);

  useEffect(() => () => clearTimeouts(), []);

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="container max-w-lg py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/games"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <h1 className="font-display text-2xl font-bold tracking-wider">SIMON SAYS</h1>
        </div>

        {!isPlaying && !gameOver && (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">🔴🟢🔵🟡</p>
            <h2 className="font-display text-xl mb-4">Remember the Sequence</h2>
            <p className="text-muted-foreground mb-6">Watch the pattern and repeat it. Each round adds one more color!</p>
            <Button onClick={startGame} className="gradient-neon glow-blue font-display">START GAME</Button>
          </div>
        )}

        {(isPlaying || gameOver) && (
          <>
            <div className="text-center mb-4">
              <p className="font-display text-lg">Round: <span className="text-primary">{score + 1}</span></p>
              {phase === "showing" && <p className="text-muted-foreground text-sm animate-pulse">Watch carefully...</p>}
              {phase === "input" && <p className="text-neon-green text-sm">Your turn!</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
              {COLORS.map((color) => (
                <motion.button
                  key={color}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePress(color)}
                  disabled={phase !== "input"}
                  className={`h-28 rounded-2xl transition-all duration-200 ${
                    activeColor === color ? COLOR_ACTIVE[color] : COLOR_MAP[color]
                  } ${phase !== "input" ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}`}
                />
              ))}
            </div>

            {gameOver && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-6 rounded-xl border border-border bg-card">
                <h2 className="font-display text-2xl font-bold text-neon-orange mb-2">GAME OVER</h2>
                <p className="text-muted-foreground mb-1">You reached round {score + 1}</p>
                <p className="font-display text-3xl font-bold text-primary mb-4">{score * 10} pts</p>
                <Button onClick={startGame} className="gradient-neon glow-blue font-display gap-2"><RotateCcw className="h-4 w-4" /> PLAY AGAIN</Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SimonSays;
