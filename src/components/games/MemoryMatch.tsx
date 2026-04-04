import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const emojis = ["🎮", "🎯", "🚀", "⚡", "🔥", "💎", "🌟", "🎲"];
const generateCards = () => {
  const pairs = [...emojis, ...emojis];
  return pairs.sort(() => Math.random() - 0.5).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
};

const MemoryMatch = () => {
  const [cards, setCards] = useState(generateCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started || gameOver) return;
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [started, gameOver]);

  useEffect(() => {
    if (cards.every((c) => c.matched)) setGameOver(true);
  }, [cards]);

  const handleFlip = useCallback(
    (id: number) => {
      if (selected.length === 2) return;
      if (cards[id].flipped || cards[id].matched) return;
      if (!started) setStarted(true);

      const newCards = [...cards];
      newCards[id].flipped = true;
      setCards(newCards);

      const newSelected = [...selected, id];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setMoves((m) => m + 1);
        const [a, b] = newSelected;
        if (newCards[a].emoji === newCards[b].emoji) {
          setTimeout(() => {
            setCards((prev) => prev.map((c) => (c.id === a || c.id === b ? { ...c, matched: true } : c)));
            setSelected([]);
          }, 300);
        } else {
          setTimeout(() => {
            setCards((prev) => prev.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false } : c)));
            setSelected([]);
          }, 800);
        }
      }
    },
    [cards, selected, started]
  );

  const reset = () => {
    setCards(generateCards());
    setSelected([]);
    setMoves(0);
    setTime(0);
    setGameOver(false);
    setStarted(false);
  };

  const score = gameOver ? Math.max(100, 1000 - moves * 20 - time * 5) : 0;

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8 max-w-lg">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/games"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-wider">🧠 MEMORY MATCH</h1>
            <p className="text-xs text-muted-foreground">Find all matching pairs</p>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" /> {time}s</span>
            <span className="text-muted-foreground">Moves: {moves}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={reset}><RotateCcw className="h-4 w-4 mr-1" /> Reset</Button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFlip(card.id)}
              className={`aspect-square rounded-xl cursor-pointer flex items-center justify-center text-3xl border transition-all ${
                card.flipped || card.matched
                  ? "bg-primary/10 border-primary/40"
                  : "bg-muted border-border hover:border-primary/30"
              } ${card.matched ? "glow-green" : ""}`}
            >
              <AnimatePresence mode="wait">
                {(card.flipped || card.matched) && (
                  <motion.span initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} exit={{ rotateY: 90 }}>
                    {card.emoji}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {gameOver && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <Card className="bg-card border-primary/30 glow-blue">
              <CardContent className="p-6 text-center">
                <Star className="h-10 w-10 text-neon-orange mx-auto mb-2" />
                <h2 className="font-display text-xl font-bold mb-1">GAME COMPLETE!</h2>
                <p className="text-muted-foreground text-sm mb-3">{moves} moves • {time}s</p>
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

export default MemoryMatch;
