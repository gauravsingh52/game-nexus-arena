import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScoreSaver } from "@/hooks/useScoreSaver";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const questions: Question[] = [
  { question: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Control Processing Unit"], correct: 0 },
  { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
  { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: 2 },
  { question: "In what year did the first iPhone launch?", options: ["2005", "2006", "2007", "2008"], correct: 2 },
  { question: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2 },
  { question: "Which language runs in a web browser?", options: ["Java", "C", "Python", "JavaScript"], correct: 3 },
  { question: "How many bits are in a byte?", options: ["4", "8", "16", "32"], correct: 1 },
  { question: "What does HTML stand for?", options: ["HyperText Markup Language", "HighText Machine Language", "HyperText Machine Learning", "None of the above"], correct: 0 },
  { question: "Which company created React?", options: ["Google", "Apple", "Facebook", "Microsoft"], correct: 2 },
  { question: "What is the speed of light (km/s)?", options: ["150,000", "300,000", "450,000", "600,000"], correct: 1 },
];

const QuizChallenge = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const { saveScore, resetSaver } = useScoreSaver();

  const q = questions[current];

  useEffect(() => {
    if (gameOver && score > 0) {
      saveScore({ gameSlug: "quiz-challenge", score, accuracy: correctCount / questions.length });
    }
  }, [gameOver]);

  const handleAnswer = useCallback((idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === q.correct) {
      setScore((s) => s + 100 + (current + 1) * 10);
      setCorrectCount((c) => c + 1);
    }
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setGameOver(true);
      } else {
        setCurrent((c) => c + 1);
        setAnswered(null);
      }
    }, 1000);
  }, [answered, current, q.correct]);

  const reset = () => {
    setCurrent(0); setScore(0); setAnswered(null);
    setGameOver(false); setCorrectCount(0);
    resetSaver();
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8 max-w-lg">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/games"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-wider">🧩 QUIZ CHALLENGE</h1>
            <p className="text-xs text-muted-foreground">Test your knowledge</p>
          </div>
        </div>

        {!gameOver ? (
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="flex justify-between mb-4">
                <Badge variant="outline" className="border-primary/30 text-primary">
                  Q{current + 1}/{questions.length}
                </Badge>
                <span className="font-mono text-sm text-primary">{score} pts</span>
              </div>

              <Card className="bg-card border-border mb-6">
                <CardContent className="p-6">
                  <p className="font-heading text-lg font-semibold">{q.question}</p>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const isCorrect = answered !== null && i === q.correct;
                  const isWrong = answered === i && i !== q.correct;
                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(i)}
                      className={`w-full text-left p-4 rounded-xl border transition-all font-heading ${
                        isCorrect
                          ? "border-neon-green bg-neon-green/10 text-neon-green"
                          : isWrong
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <span className="text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-card border-primary/30 glow-blue">
              <CardContent className="p-6 text-center">
                <Star className="h-10 w-10 text-neon-orange mx-auto mb-2" />
                <h2 className="font-display text-xl font-bold mb-1">QUIZ COMPLETE!</h2>
                <p className="text-muted-foreground text-sm mb-3">{correctCount}/{questions.length} correct</p>
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

export default QuizChallenge;
