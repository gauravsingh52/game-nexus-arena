import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useScoreSaver } from "@/hooks/useScoreSaver";
import { useAuth } from "@/hooks/useAuth";

const MAX_GUESSES = 7;

const NumberGuess = () => {
  const { user } = useAuth();
  const { saveScore, resetSaver } = useScoreSaver();
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<{ value: number; hint: string }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

  const startGame = () => {
    resetSaver();
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setGuesses([]);
    setGameOver(false);
    setWon(false);
    setPlaying(true);
    setScore(0);
    setRound(1);
  };

  const nextRound = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setGuesses([]);
    setWon(false);
    setRound(r => r + 1);
  };

  const submitGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 100) return;

    const diff = Math.abs(num - target);
    let hint = "";
    if (num === target) hint = "🎯 Correct!";
    else if (diff <= 3) hint = num < target ? "🔥 Scorching! Go higher" : "🔥 Scorching! Go lower";
    else if (diff <= 10) hint = num < target ? "🌡️ Warm! Go higher" : "🌡️ Warm! Go lower";
    else if (diff <= 25) hint = num < target ? "❄️ Cool. Go higher" : "❄️ Cool. Go lower";
    else hint = num < target ? "🧊 Freezing! Go higher" : "🧊 Freezing! Go lower";

    const newGuesses = [...guesses, { value: num, hint }];
    setGuesses(newGuesses);
    setGuess("");

    if (num === target) {
      const bonus = (MAX_GUESSES - newGuesses.length + 1) * 30;
      setScore(s => s + 100 + bonus);
      setWon(true);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
    }
  };

  useEffect(() => {
    if (gameOver && score > 0 && user) {
      saveScore({ gameSlug: "number-guess", score });
    }
  }, [gameOver]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submitGuess();
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="container max-w-md py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/games"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <h1 className="font-display text-2xl font-bold tracking-wider">NUMBER GUESS</h1>
          <div className="ml-auto font-display text-lg text-primary">{score} pts</div>
        </div>

        {!playing ? (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">🔢</p>
            <h2 className="font-display text-xl mb-4">Guess the Number</h2>
            <p className="text-muted-foreground mb-6">I'm thinking of a number between 1 and 100. You have {MAX_GUESSES} guesses. Hot/cold hints guide you!</p>
            <Button onClick={startGame} className="gradient-neon glow-blue font-display">START GAME</Button>
          </div>
        ) : gameOver ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-6 rounded-xl border border-border bg-card">
            <h2 className="font-display text-2xl font-bold text-neon-orange mb-2">GAME OVER</h2>
            <p className="text-muted-foreground mb-1">The number was <span className="text-foreground font-bold">{target}</span></p>
            <p className="text-muted-foreground mb-1">Rounds completed: {round - 1}</p>
            <p className="font-display text-3xl font-bold text-primary mb-4">{score} pts</p>
            <Button onClick={startGame} className="gradient-neon glow-blue font-display gap-2"><RotateCcw className="h-4 w-4" /> PLAY AGAIN</Button>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-4">
              <p className="font-display text-sm">Round {round}</p>
              {won ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                  <p className="text-neon-green font-display text-lg mb-3">🎯 You got it!</p>
                  <Button onClick={nextRound} className="gradient-neon font-display text-sm">Next Round</Button>
                </motion.div>
              ) : (
                <p className="text-muted-foreground text-sm">{MAX_GUESSES - guesses.length} guesses remaining</p>
              )}
            </div>

            {!won && (
              <div className="flex gap-2 mb-6">
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="1-100"
                  className="font-display text-center text-lg"
                />
                <Button onClick={submitGuess} className="gradient-neon font-display">GUESS</Button>
              </div>
            )}

            <div className="space-y-2">
              {guesses.map((g, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                >
                  <span className="font-display text-lg font-bold">{g.value}</span>
                  <span className="text-sm">{g.hint}</span>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NumberGuess;
