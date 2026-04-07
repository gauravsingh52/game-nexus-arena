import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useScoreSaver } from "@/hooks/useScoreSaver";

const COLORS = [
  { name: "RED", hsl: "0 80% 55%" },
  { name: "BLUE", hsl: "220 90% 56%" },
  { name: "GREEN", hsl: "120 60% 45%" },
  { name: "YELLOW", hsl: "50 90% 55%" },
  { name: "PURPLE", hsl: "270 80% 60%" },
  { name: "ORANGE", hsl: "30 90% 55%" },
  { name: "PINK", hsl: "330 85% 60%" },
  { name: "CYAN", hsl: "180 80% 50%" },
];

const GAME_TIME = 30;
const MATCH_CHANCE = 0.35;

const ColorMatch = () => {
  const [word, setWord] = useState("");
  const [wordColor, setWordColor] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [highScore, setHighScore] = useState(0);
  const { saveScore, resetSaver } = useScoreSaver();

  const nextRound = useCallback(() => {
    const wordIdx = Math.floor(Math.random() * COLORS.length);
    const match = Math.random() < MATCH_CHANCE;
    let colorIdx = wordIdx;
    if (!match) {
      do { colorIdx = Math.floor(Math.random() * COLORS.length); } while (colorIdx === wordIdx);
    }
    setWord(COLORS[wordIdx].name);
    setWordColor(COLORS[colorIdx].hsl);
    setIsMatch(match);
    setFeedback(null);
  }, []);

  const start = () => {
    setScore(0);
    setStreak(0);
    setTotal(0);
    setCorrect(0);
    setTimeLeft(GAME_TIME);
    setGameOver(false);
    setPlaying(true);
    resetSaver();
    nextRound();
  };

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPlaying(false);
          setGameOver(true);
          setHighScore(h => Math.max(h, score));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [playing, score]);

  useEffect(() => {
    if (gameOver && score > 0) {
      const acc = total > 0 ? correct / total : 0;
      saveScore({ gameSlug: "color-match", score, accuracy: acc });
    }
  }, [gameOver]);

  const answer = (userSaysMatch: boolean) => {
    if (!playing) return;
    setTotal(t => t + 1);
    if (userSaysMatch === isMatch) {
      const bonus = streak >= 5 ? 15 : streak >= 3 ? 10 : 5;
      setScore(s => s + bonus);
      setStreak(s => s + 1);
      setCorrect(c => c + 1);
      setFeedback("correct");
    } else {
      setStreak(0);
      setFeedback("wrong");
    }
    setTimeout(nextRound, 300);
  };

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="min-h-screen pt-20 pb-10 flex flex-col items-center">
      <div className="container max-w-lg">
        <Link to="/games" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 font-heading">
          <ArrowLeft className="h-4 w-4" /> Back to Games
        </Link>

        <h1 className="font-display text-3xl font-bold tracking-wider mb-2">🎨 COLOR MATCH</h1>
        <p className="text-sm text-muted-foreground mb-4 font-heading">Does the <strong>text color</strong> match the <strong>word meaning</strong>?</p>

        <div className="flex items-center gap-6 mb-6 font-display text-sm tracking-wider">
          <span>SCORE: <span className="text-neon-green">{score}</span></span>
          <span>STREAK: <span className="text-neon-orange">x{streak}</span></span>
          <span>TIME: <span className={timeLeft <= 5 ? "text-destructive animate-pulse" : "text-primary"}>{timeLeft}s</span></span>
        </div>

        {playing && (
          <div className={`rounded-2xl border-2 p-12 text-center mb-8 transition-all duration-200 ${
            feedback === "correct" ? "border-neon-green bg-neon-green/5" :
            feedback === "wrong" ? "border-destructive bg-destructive/5" :
            "border-border bg-card/50"
          }`}>
            <p
              className="font-display text-6xl md:text-7xl font-black tracking-wider"
              style={{ color: `hsl(${wordColor})` }}
            >
              {word}
            </p>
          </div>
        )}

        {playing && (
          <div className="flex gap-4 justify-center">
            <Button onClick={() => answer(true)} size="lg" className="bg-neon-green/20 border border-neon-green/40 text-neon-green hover:bg-neon-green/30 font-display tracking-wider flex-1 max-w-[200px] h-14">
              ✓ MATCH
            </Button>
            <Button onClick={() => answer(false)} size="lg" className="bg-neon-pink/20 border border-neon-pink/40 text-neon-pink hover:bg-neon-pink/30 font-display tracking-wider flex-1 max-w-[200px] h-14">
              ✗ NO MATCH
            </Button>
          </div>
        )}

        {!playing && !gameOver && (
          <div className="text-center mt-8">
            <div className="rounded-2xl border border-border bg-card/50 p-12 mb-6">
              <p className="font-display text-5xl mb-4">🎨</p>
              <p className="text-muted-foreground font-heading">A color word will appear in a random color. Decide if the <strong>ink color</strong> matches the <strong>word</strong>.</p>
            </div>
            <Button onClick={start} className="gradient-neon glow-blue font-display tracking-wider px-10">START GAME</Button>
          </div>
        )}

        {gameOver && (
          <div className="text-center mt-8 space-y-3">
            <p className="font-display text-2xl font-bold">GAME OVER!</p>
            <p className="font-display text-lg text-neon-green">Score: {score}</p>
            <p className="text-sm text-muted-foreground font-heading">Accuracy: {accuracy}% | High Score: {highScore}</p>
            <Button onClick={start} className="gradient-neon glow-blue font-display tracking-wider gap-2">
              <RotateCcw className="h-4 w-4" /> PLAY AGAIN
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorMatch;
