import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const wordList = [
  "react", "game", "score", "level", "speed", "quick", "flash", "power",
  "arena", "nexus", "pixel", "cyber", "blaze", "storm", "quest", "forge",
  "blade", "ghost", "night", "star", "void", "pulse", "wave", "bolt",
  "shine", "glow", "flame", "frost", "drift", "clash",
];

const GAME_TIME = 60;

const SpeedTyper = () => {
  const [current, setCurrent] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(GAME_TIME);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [streak, setStreak] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const nextWord = useCallback(() => {
    setCurrent(wordList[Math.floor(Math.random() * wordList.length)]);
    setInput("");
  }, []);

  useEffect(() => { nextWord(); }, [nextWord]);

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

  const handleInput = (val: string) => {
    if (gameOver) return;
    if (!started) setStarted(true);
    setInput(val);
    if (val.toLowerCase() === current.toLowerCase()) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore((s) => s + 100 + (newStreak >= 3 ? 50 : 0));
      setWordsTyped((w) => w + 1);
      nextWord();
    }
  };

  const reset = () => {
    setScore(0); setTime(GAME_TIME); setStarted(false);
    setGameOver(false); setWordsTyped(0); setStreak(0);
    nextWord();
    inputRef.current?.focus();
  };

  const isCorrectSoFar = current.toLowerCase().startsWith(input.toLowerCase());

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8 max-w-lg">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/games"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-wider">⌨️ SPEED TYPER</h1>
            <p className="text-xs text-muted-foreground">Type as fast as you can!</p>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" /> {time}s</span>
            <span className="text-muted-foreground">Words: {wordsTyped}</span>
            {streak >= 3 && <span className="text-neon-orange">🔥 x{streak}</span>}
          </div>
          <Button variant="ghost" size="sm" onClick={reset}><RotateCcw className="h-4 w-4 mr-1" /> Reset</Button>
        </div>

        <Progress value={(time / GAME_TIME) * 100} className="mb-6 h-2" />

        {!gameOver ? (
          <div className="text-center space-y-6">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-xl border border-border bg-card"
            >
              <p className="font-display text-4xl md:text-5xl font-black tracking-wider text-foreground">{current}</p>
            </motion.div>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="Type the word..."
              className={`text-center text-xl font-heading bg-muted border-2 h-14 ${
                input ? (isCorrectSoFar ? "border-neon-green" : "border-destructive") : "border-border"
              }`}
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
                <p className="text-muted-foreground text-sm mb-3">{wordsTyped} words typed</p>
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

export default SpeedTyper;
