import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, RotateCcw, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const WORDS = [
  { word: "GALAXY", hint: "Stars and planets" },
  { word: "DRAGON", hint: "Fire-breathing creature" },
  { word: "SHIELD", hint: "Protection in battle" },
  { word: "KNIGHT", hint: "Medieval warrior" },
  { word: "WIZARD", hint: "Magical spellcaster" },
  { word: "PHOENIX", hint: "Rises from ashes" },
  { word: "THUNDER", hint: "Sound after lightning" },
  { word: "CRYSTAL", hint: "Clear mineral stone" },
  { word: "SHADOW", hint: "Dark silhouette" },
  { word: "LEGEND", hint: "Famous story or person" },
  { word: "COMBAT", hint: "Fighting in battle" },
  { word: "PORTAL", hint: "Gateway to another place" },
  { word: "ENERGY", hint: "Power source" },
  { word: "ROCKET", hint: "Flies to space" },
  { word: "PIRATE", hint: "Sails the seas" },
  { word: "FROZEN", hint: "Turned to ice" },
  { word: "JUNGLE", hint: "Dense tropical forest" },
  { word: "VORTEX", hint: "Spinning whirlpool" },
  { word: "MYSTIC", hint: "Mysterious and magical" },
  { word: "BLAZE", hint: "Intense fire" },
];

const GAME_TIME = 60;

const scramble = (word: string): string => {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("") === word ? scramble(word) : arr.join("");
};

const WordScramble = () => {
  const [currentWord, setCurrentWord] = useState({ word: "", hint: "" });
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

  const pickWord = useCallback((used: Set<string>) => {
    const available = WORDS.filter(w => !used.has(w.word));
    if (available.length === 0) return WORDS[Math.floor(Math.random() * WORDS.length)];
    return available[Math.floor(Math.random() * available.length)];
  }, []);

  const nextWord = useCallback((used: Set<string>) => {
    const w = pickWord(used);
    setCurrentWord(w);
    setScrambled(scramble(w.word));
    setGuess("");
    setShowHint(false);
    setFeedback(null);
  }, [pickWord]);

  const start = () => {
    const used = new Set<string>();
    setUsedWords(used);
    setScore(0);
    setSolved(0);
    setTimeLeft(GAME_TIME);
    setGameOver(false);
    setPlaying(true);
    nextWord(used);
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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playing || !guess.trim()) return;
    if (guess.toUpperCase() === currentWord.word) {
      const bonus = showHint ? 5 : 10;
      const timeBonus = Math.floor(timeLeft / 10);
      setScore(s => s + bonus + timeBonus);
      setSolved(s => s + 1);
      setFeedback("correct");
      const newUsed = new Set(usedWords);
      newUsed.add(currentWord.word);
      setUsedWords(newUsed);
      setTimeout(() => nextWord(newUsed), 500);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 500);
    }
  };

  const skip = () => {
    if (!playing) return;
    const newUsed = new Set(usedWords);
    newUsed.add(currentWord.word);
    setUsedWords(newUsed);
    nextWord(newUsed);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 flex flex-col items-center">
      <div className="container max-w-lg">
        <Link to="/games" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 font-heading">
          <ArrowLeft className="h-4 w-4" /> Back to Games
        </Link>

        <h1 className="font-display text-3xl font-bold tracking-wider mb-2">🔤 WORD SCRAMBLE</h1>
        <div className="flex items-center gap-6 mb-6 font-display text-sm tracking-wider">
          <span>SCORE: <span className="text-neon-green">{score}</span></span>
          <span>SOLVED: <span className="text-neon-purple">{solved}</span></span>
          <span>TIME: <span className={timeLeft <= 10 ? "text-destructive animate-pulse" : "text-primary"}>{timeLeft}s</span></span>
        </div>

        {playing && (
          <>
            <div className={`rounded-2xl border-2 p-8 text-center mb-6 transition-all ${
              feedback === "correct" ? "border-neon-green bg-neon-green/5" :
              feedback === "wrong" ? "border-destructive bg-destructive/5 animate-shake" :
              "border-border bg-card/50"
            }`}>
              <p className="font-display text-4xl md:text-5xl font-black tracking-[0.3em] text-primary mb-4">
                {scrambled}
              </p>
              {showHint && (
                <p className="text-sm text-neon-orange font-heading">💡 Hint: {currentWord.hint}</p>
              )}
            </div>

            <form onSubmit={submit} className="flex gap-3 mb-4">
              <Input
                value={guess}
                onChange={e => setGuess(e.target.value)}
                placeholder="Type your answer..."
                className="font-display tracking-wider uppercase text-center text-lg bg-card/50 border-border"
                autoFocus
              />
              <Button type="submit" className="gradient-neon font-display tracking-wider">SUBMIT</Button>
            </form>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" size="sm" onClick={() => setShowHint(true)} disabled={showHint} className="font-heading gap-1">
                <Lightbulb className="h-3 w-3" /> Hint
              </Button>
              <Button variant="outline" size="sm" onClick={skip} className="font-heading">Skip →</Button>
            </div>
          </>
        )}

        {!playing && !gameOver && (
          <div className="text-center mt-8">
            <div className="rounded-2xl border border-border bg-card/50 p-12 mb-6">
              <p className="font-display text-5xl mb-4">🔤</p>
              <p className="text-muted-foreground font-heading">Unscramble the letters to form the correct word. Use hints if you get stuck!</p>
            </div>
            <Button onClick={start} className="gradient-neon glow-blue font-display tracking-wider px-10">START GAME</Button>
          </div>
        )}

        {gameOver && (
          <div className="text-center mt-8 space-y-3">
            <p className="font-display text-2xl font-bold">TIME'S UP!</p>
            <p className="font-display text-lg text-neon-green">Score: {score}</p>
            <p className="text-sm text-muted-foreground font-heading">Words Solved: {solved} | High Score: {highScore}</p>
            <Button onClick={start} className="gradient-neon glow-blue font-display tracking-wider gap-2">
              <RotateCcw className="h-4 w-4" /> PLAY AGAIN
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordScramble;
