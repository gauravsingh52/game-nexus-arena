import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScoreSaver } from "@/hooks/useScoreSaver";
import { useAuth } from "@/hooks/useAuth";

type Cell = "X" | "O" | null;
type Board = Cell[];

const WINS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

const checkWinner = (b: Board): Cell => {
  for (const [a, c, d] of WINS) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  }
  return null;
};

const minimax = (b: Board, isMax: boolean): number => {
  const w = checkWinner(b);
  if (w === "O") return 10;
  if (w === "X") return -10;
  if (b.every(c => c !== null)) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) { b[i] = "O"; best = Math.max(best, minimax(b, false)); b[i] = null; }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) { b[i] = "X"; best = Math.min(best, minimax(b, true)); b[i] = null; }
    }
    return best;
  }
};

const aiMove = (b: Board): number => {
  let bestVal = -Infinity, bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = "O";
      const val = minimax(b, false);
      b[i] = null;
      if (val > bestVal) { bestVal = val; bestMove = i; }
    }
  }
  return bestMove;
};

const TicTacToe = () => {
  const { user } = useAuth();
  const { saveScore, resetSaver } = useScoreSaver();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [winner, setWinner] = useState<Cell>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [wins, setWins] = useState(0);
  const [gameCount, setGameCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleClick = (i: number) => {
    if (board[i] || winner || isDraw || !playerTurn) return;
    const b = [...board];
    b[i] = "X";
    setBoard(b);
    const w = checkWinner(b);
    if (w) { setWinner(w); return; }
    if (b.every(c => c !== null)) { setIsDraw(true); return; }
    setPlayerTurn(false);
  };

  useEffect(() => {
    if (!playerTurn && !winner && !isDraw) {
      const timer = setTimeout(() => {
        const b = [...board];
        const move = aiMove(b);
        if (move >= 0) {
          b[move] = "O";
          setBoard(b);
          const w = checkWinner(b);
          if (w) setWinner(w);
          else if (b.every(c => c !== null)) setIsDraw(true);
        }
        setPlayerTurn(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [playerTurn, winner, isDraw, board]);

  useEffect(() => {
    if (winner === "X") {
      setWins(w => w + 1);
      setGameCount(c => c + 1);
    } else if (winner === "O" || isDraw) {
      setGameCount(c => c + 1);
    }
  }, [winner, isDraw]);

  const endSession = () => {
    setGameOver(true);
    if (wins > 0 && user) {
      saveScore({ gameSlug: "tic-tac-toe", score: wins * 50, accuracy: gameCount > 0 ? wins / gameCount : 0 });
    }
  };

  const nextRound = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsDraw(false);
    setPlayerTurn(true);
  };

  const restart = () => {
    resetSaver();
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsDraw(false);
    setPlayerTurn(true);
    setWins(0);
    setGameCount(0);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="container max-w-md py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/games"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <h1 className="font-display text-2xl font-bold tracking-wider">TIC TAC TOE</h1>
        </div>

        <div className="flex justify-between mb-4 text-sm font-display">
          <span>Wins: <span className="text-neon-green">{wins}</span></span>
          <span>Games: <span className="text-primary">{gameCount}</span></span>
        </div>

        {!gameOver ? (
          <>
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6">
              {board.map((cell, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleClick(i)}
                  className={`aspect-square rounded-xl border border-border bg-card flex items-center justify-center font-display text-3xl font-bold transition-colors ${
                    !cell && playerTurn ? "hover:bg-muted cursor-pointer" : "cursor-default"
                  } ${cell === "X" ? "text-neon-blue" : cell === "O" ? "text-neon-pink" : ""}`}
                >
                  {cell && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>{cell}</motion.span>}
                </motion.button>
              ))}
            </div>

            {(winner || isDraw) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-4 rounded-xl border border-border bg-card mb-4">
                <p className="font-display text-lg font-bold mb-3">
                  {winner === "X" ? "You Win! 🎉" : winner === "O" ? "AI Wins 🤖" : "It's a Draw! 🤝"}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={nextRound} className="gradient-neon font-display text-sm">Next Round</Button>
                  <Button onClick={endSession} variant="outline" className="font-display text-sm">End & Save</Button>
                </div>
              </motion.div>
            )}

            {!winner && !isDraw && (
              <div className="text-center">
                <Button onClick={endSession} variant="outline" size="sm" className="font-display">End Session</Button>
              </div>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-6 rounded-xl border border-border bg-card">
            <h2 className="font-display text-2xl font-bold text-neon-orange mb-2">SESSION OVER</h2>
            <p className="text-muted-foreground mb-1">You won {wins} out of {gameCount} games</p>
            <p className="font-display text-3xl font-bold text-primary mb-4">{wins * 50} pts</p>
            <Button onClick={restart} className="gradient-neon glow-blue font-display gap-2"><RotateCcw className="h-4 w-4" /> PLAY AGAIN</Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TicTacToe;
