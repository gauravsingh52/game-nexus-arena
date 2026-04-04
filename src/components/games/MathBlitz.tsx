import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const GAME_TIME = 60;

type Op = "+" | "-" | "×";

const generateProblem = (level: number) => {
  const ops: Op[] = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * (level > 5 ? 3 : 2))];
  const max = Math.min(10 + level * 5, 50);
  let a: number, b: number, answer: number;

  if (op === "+") {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * max) + 1;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * a) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
    answer = a * b;
  }

  return { display: `${a} ${op} ${b}`, answer };
};

const MathBlitz = () => {
  const [problem, setProblem] = useState(generateProblem(1));
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(GAME_TIME);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [solved, setSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (!started || gameOver) return;
    const t = setInterval(() => {
      setTime((p) => {
        if (p <= 1) { setGameOver(true); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, gameOver]);

  const handleInput = useCallback((val: string) => {
    if (gameOver) return;
    if (!started) setStarted(true);
    setInput(val);

    const num = parseInt(val);
    if (!isNaN(num) && num === problem.answer) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const newSolved = solved + 1;
      setSolved(newSolved);
      const newLevel = Math.floor(newSolved / 5) + 1;
      setLevel(newLevel);
      setScore((s) => s + 50 + newLevel * 10 + (newStreak >= 3 ? 30 : 0));
      setProblem(generateProblem(newLevel));
      setInput("");
    }
  }, [gameOver, started, problem.answer, streak, solved]);

  const reset = () => {
    setScore(0); setTime(GAME_TIME); setStarted(false);
    setGameOver(false); setSolved(0); setStreak(0); setLevel(1);
    setProblem(generateProblem(1)); setInput("");
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8 max-w-lg">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/games"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-wider">🔢 MATH BLITZ</h1>
            <p className="text-xs text-muted-foreground">Solve math problems fast!</p>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" /> {time}s</span>
            <span className="text-muted-foreground">Solved: {solved}</span>
            <span className="text-muted-foreground">Lvl {level}</span>
            {streak >= 3 && <span className="text-neon-orange">🔥 x{streak}</span>}
          </div>
          <Button variant="ghost" size="sm" onClick={reset}><RotateCcw className="h-4 w-4 mr-1" /> Reset</Button>
        </div>

        <Progress value={(time / GAME_TIME) * 100} className="mb-6 h-2" />

        {!gameOver ? (
          <div className="text-center space-y-6">
            <motion.div
              key={problem.display}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 rounded-xl border border-border bg-card"
            >
              <p className="font-display text-4xl md:text-5xl font-black tracking-wider">{problem.display} = ?</p>
            </motion.div>

            <Input
              value={input}
              onChange={(e) => handleInput(e.target.value)}
              type="number"
              placeholder="Your answer..."
              className="text-center text-2xl font-display bg-muted border-border h-14"
              autoFocus
            />

            <p className="font-display text-2xl font-bold text-primary">{score} pts</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-card border-primary/30 glow-blue">
              <CardContent className="p-6 text-center">
                <Star className="h-10 w-10 text-neon-orange mx-auto mb-2" />
                <h2 className="font-display text-xl font-bold mb-1">TIME'S UP!</h2>
                <p className="text-muted-foreground text-sm mb-3">{solved} problems solved • Level {level}</p>
                <p className="font-display text-3xl font-black text-primary">{score} pts</p>
                <Button onClick={reset} className="mt-4 gradient-neon glow-blue font-display tracking-wider">PLAY AGAIN</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MathBlitz;
