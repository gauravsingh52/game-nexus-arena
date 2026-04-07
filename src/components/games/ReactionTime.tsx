import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, Star, Crosshair } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useScoreSaver } from "@/hooks/useScoreSaver";

const TOTAL_ROUNDS = 10;

const ReactionTime = () => {
  const [phase, setPhase] = useState<"waiting" | "ready" | "go" | "result" | "done">("waiting");
  const [times, setTimes] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const startRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { saveScore, resetSaver } = useScoreSaver();

  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const best = times.length ? Math.min(...times) : 0;
  const score = times.length ? Math.max(0, Math.round(times.reduce((total, t) => total + Math.max(0, 500 - t), 0))) : 0;

  const startRound = useCallback(() => {
    setPhase("ready");
    const delay = 1500 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      startRef.current = Date.now();
      setPhase("go");
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (phase === "waiting") {
      startRound();
    } else if (phase === "ready") {
      clearTimeout(timeoutRef.current);
      setPhase("waiting");
    } else if (phase === "go") {
      const reaction = Date.now() - startRef.current;
      setCurrentTime(reaction);
      setTimes((p) => [...p, reaction]);
      setRound((r) => r + 1);
      setPhase("result");
    } else if (phase === "result") {
      if (round >= TOTAL_ROUNDS) {
        setPhase("done");
      } else {
        startRound();
      }
    }
  }, [phase, round, startRound]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (phase === "done" && score > 0) {
      saveScore({ gameSlug: "reaction-time", score, completionTime: avg });
    }
  }, [phase]);

  const reset = () => {
    clearTimeout(timeoutRef.current);
    setPhase("waiting"); setTimes([]); setRound(0); setCurrentTime(0);
    resetSaver();
  };

  const bgColor = phase === "ready" ? "bg-destructive/20" : phase === "go" ? "bg-neon-green/20" : "bg-card";

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8 max-w-lg">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/games"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-wider">⚡ REACTION TIME</h1>
            <p className="text-xs text-muted-foreground">Test your reflexes</p>
          </div>
          <div className="ml-auto">
            <Button variant="ghost" size="sm" onClick={reset}><RotateCcw className="h-4 w-4 mr-1" /> Reset</Button>
          </div>
        </div>

        {phase !== "done" && <p className="text-sm text-muted-foreground mb-4">Round {Math.min(round + 1, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}</p>}

        {phase !== "done" ? (
          <motion.div
            onClick={handleClick}
            className={`rounded-2xl border border-border ${bgColor} flex flex-col items-center justify-center cursor-pointer select-none transition-colors`}
            style={{ minHeight: 300 }}
            whileTap={{ scale: 0.98 }}
          >
            {phase === "waiting" && (
              <div className="text-center">
                <Crosshair className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse-glow" />
                <p className="font-display text-lg font-bold tracking-wider">CLICK TO START</p>
                <p className="text-sm text-muted-foreground mt-1">Wait for green, then click!</p>
              </div>
            )}
            {phase === "ready" && (
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-destructive tracking-wider">WAIT...</p>
                <p className="text-sm text-muted-foreground mt-1">Don't click yet!</p>
              </div>
            )}
            {phase === "go" && (
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-center">
                <p className="font-display text-3xl font-black text-neon-green tracking-wider">CLICK NOW!</p>
              </motion.div>
            )}
            {phase === "result" && (
              <div className="text-center">
                <p className="font-display text-4xl font-black text-primary">{currentTime}ms</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {currentTime < 200 ? "⚡ Lightning fast!" : currentTime < 300 ? "🔥 Great!" : currentTime < 400 ? "👍 Good" : "Keep trying!"}
                </p>
                <p className="text-xs text-muted-foreground mt-4">Click to continue</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-card border-primary/30 glow-blue">
              <CardContent className="p-6 text-center">
                <Star className="h-10 w-10 text-neon-orange mx-auto mb-2" />
                <h2 className="font-display text-xl font-bold mb-3">TEST COMPLETE!</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Average</p>
                    <p className="font-display text-xl font-bold text-foreground">{avg}ms</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Best</p>
                    <p className="font-display text-xl font-bold text-neon-green">{best}ms</p>
                  </div>
                </div>
                <p className="font-display text-3xl font-black text-primary">{score} pts</p>
                <Button onClick={reset} className="mt-4 gradient-neon glow-blue font-display tracking-wider">PLAY AGAIN</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {times.length > 0 && phase !== "done" && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {times.map((t, i) => (
              <span key={i} className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">{t}ms</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactionTime;
