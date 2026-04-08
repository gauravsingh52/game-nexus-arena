import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScoreSaver } from "@/hooks/useScoreSaver";
import { useAuth } from "@/hooks/useAuth";

const WORDS = [
  "JAVASCRIPT", "TYPESCRIPT", "ALGORITHM", "FUNCTION", "VARIABLE",
  "COMPONENT", "DATABASE", "FRAMEWORK", "INTERFACE", "PROMISE",
  "QUANTUM", "GALAXY", "NEBULA", "PHANTOM", "CIPHER",
  "ECLIPSE", "VORTEX", "MATRIX", "ENIGMA", "ODYSSEY",
  "HORIZON", "PARADOX", "CRYSTAL", "PHOENIX", "ZENITH",
];

const MAX_WRONG = 6;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const Hangman = () => {
  const { user } = useAuth();
  const { saveScore, resetSaver } = useScoreSaver();
  const [word, setWord] = useState("");
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const wrongCount = [...guessed].filter(l => !word.includes(l)).length;
  const isLost = wrongCount >= MAX_WRONG;
  const isWon = word.length > 0 && word.split("").every(l => guessed.has(l));

  const pickWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

  const startGame = () => {
    resetSaver();
    setWord(pickWord());
    setGuessed(new Set());
    setScore(0);
    setRound(1);
    setGameOver(false);
  };

  const guess = (letter: string) => {
    if (isLost || isWon || guessed.has(letter)) return;
    setGuessed(prev => new Set(prev).add(letter));
  };

  useEffect(() => {
    if (isWon && !gameOver) {
      const bonus = (MAX_WRONG - wrongCount) * 20;
      setScore(s => s + 100 + bonus);
      setTimeout(() => {
        setWord(pickWord());
        setGuessed(new Set());
        setRound(r => r + 1);
      }, 1500);
    }
  }, [isWon]);

  useEffect(() => {
    if (isLost && !gameOver) {
      setGameOver(true);
      if (score > 0 && user) {
        saveScore({ gameSlug: "hangman", score, accuracy: round > 1 ? (round - 1) / round : 0 });
      }
    }
  }, [isLost]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (ALPHABET.includes(key)) guess(key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [guessed, word, isLost, isWon]);

  const hangmanParts = [
    <circle key="head" cx="150" cy="70" r="20" stroke="currentColor" strokeWidth="3" fill="none" />,
    <line key="body" x1="150" y1="90" x2="150" y2="150" stroke="currentColor" strokeWidth="3" />,
    <line key="larm" x1="150" y1="110" x2="120" y2="140" stroke="currentColor" strokeWidth="3" />,
    <line key="rarm" x1="150" y1="110" x2="180" y2="140" stroke="currentColor" strokeWidth="3" />,
    <line key="lleg" x1="150" y1="150" x2="120" y2="190" stroke="currentColor" strokeWidth="3" />,
    <line key="rleg" x1="150" y1="150" x2="180" y2="190" stroke="currentColor" strokeWidth="3" />,
  ];

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="container max-w-lg py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/games"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <h1 className="font-display text-2xl font-bold tracking-wider">HANGMAN</h1>
          <div className="ml-auto font-display text-lg text-primary">{score} pts</div>
        </div>

        {round === 0 ? (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">🔤</p>
            <h2 className="font-display text-xl mb-4">Guess the Word</h2>
            <p className="text-muted-foreground mb-6">Guess letters to reveal the hidden word before you run out of attempts!</p>
            <Button onClick={startGame} className="gradient-neon glow-blue font-display">START GAME</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between text-sm mb-4">
              <span className="font-display">Round {round}</span>
              <span className="text-muted-foreground">{MAX_WRONG - wrongCount} guesses left</span>
            </div>

            <div className="flex justify-center mb-6">
              <svg width="200" height="220" className="text-muted-foreground">
                <line x1="40" y1="210" x2="160" y2="210" stroke="currentColor" strokeWidth="3" />
                <line x1="80" y1="210" x2="80" y2="30" stroke="currentColor" strokeWidth="3" />
                <line x1="80" y1="30" x2="150" y2="30" stroke="currentColor" strokeWidth="3" />
                <line x1="150" y1="30" x2="150" y2="50" stroke="currentColor" strokeWidth="3" />
                {hangmanParts.slice(0, wrongCount)}
              </svg>
            </div>

            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              {word.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={guessed.has(letter) ? { scale: 0.5 } : false}
                  animate={{ scale: 1 }}
                  className={`w-8 h-10 border-b-2 flex items-center justify-center font-display text-xl font-bold ${
                    guessed.has(letter) ? "border-primary text-foreground" : "border-muted-foreground"
                  } ${isLost && !guessed.has(letter) ? "text-destructive" : ""}`}
                >
                  {guessed.has(letter) || isLost ? letter : ""}
                </motion.span>
              ))}
            </div>

            {isWon && !gameOver && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-neon-green font-display mb-4 animate-pulse">
                Correct! Next word...
              </motion.p>
            )}

            <div className="flex flex-wrap justify-center gap-1.5 mb-6">
              {ALPHABET.map(letter => {
                const used = guessed.has(letter);
                const isWrong = used && !word.includes(letter);
                const isRight = used && word.includes(letter);
                return (
                  <button
                    key={letter}
                    onClick={() => guess(letter)}
                    disabled={used || isLost || isWon}
                    className={`w-9 h-9 rounded-lg font-display text-sm font-bold transition-all ${
                      isRight ? "bg-neon-green/20 text-neon-green border border-neon-green/40" :
                      isWrong ? "bg-destructive/20 text-destructive border border-destructive/40 opacity-50" :
                      used ? "opacity-30" :
                      "bg-card border border-border hover:border-primary/50 hover:bg-primary/10"
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {gameOver && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-6 rounded-xl border border-border bg-card">
                <h2 className="font-display text-2xl font-bold text-neon-orange mb-2">GAME OVER</h2>
                <p className="text-muted-foreground mb-1">The word was: <span className="text-foreground font-bold">{word}</span></p>
                <p className="text-muted-foreground mb-1">You solved {round - 1} word{round - 1 !== 1 ? "s" : ""}</p>
                <p className="font-display text-3xl font-bold text-primary mb-4">{score} pts</p>
                <Button onClick={startGame} className="gradient-neon glow-blue font-display gap-2"><RotateCcw className="h-4 w-4" /> PLAY AGAIN</Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Hangman;
