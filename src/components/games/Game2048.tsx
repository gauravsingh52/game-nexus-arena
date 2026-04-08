import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScoreSaver } from "@/hooks/useScoreSaver";
import { useAuth } from "@/hooks/useAuth";

type Board = number[][];

const SIZE = 4;

const emptyBoard = (): Board => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

const addRandom = (board: Board): Board => {
  const b = board.map(r => [...r]);
  const empty: [number, number][] = [];
  b.forEach((row, r) => row.forEach((v, c) => { if (v === 0) empty.push([r, c]); }));
  if (empty.length === 0) return b;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  b[r][c] = Math.random() < 0.9 ? 2 : 4;
  return b;
};

const slideRow = (row: number[]): { newRow: number[]; scored: number } => {
  const filtered = row.filter(v => v !== 0);
  let scored = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2);
      scored += filtered[i] * 2;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i++;
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { newRow: merged, scored };
};

const moveLeft = (board: Board): { board: Board; scored: number } => {
  let total = 0;
  const b = board.map(row => {
    const { newRow, scored } = slideRow(row);
    total += scored;
    return newRow;
  });
  return { board: b, scored: total };
};

const rotate90 = (board: Board): Board => {
  const b = emptyBoard();
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      b[c][SIZE - 1 - r] = board[r][c];
  return b;
};

const boardsEqual = (a: Board, b: Board) => a.every((row, r) => row.every((v, c) => v === b[r][c]));

const canMove = (board: Board): boolean => {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) return true;
      if (c + 1 < SIZE && board[r][c] === board[r][c + 1]) return true;
      if (r + 1 < SIZE && board[r][c] === board[r + 1][c]) return true;
    }
  return false;
};

const TILE_COLORS: Record<number, string> = {
  2: "bg-amber-100 text-amber-900",
  4: "bg-amber-200 text-amber-900",
  8: "bg-orange-300 text-white",
  16: "bg-orange-400 text-white",
  32: "bg-orange-500 text-white",
  64: "bg-red-500 text-white",
  128: "bg-yellow-400 text-white",
  256: "bg-yellow-500 text-white",
  512: "bg-yellow-600 text-white",
  1024: "bg-amber-500 text-white",
  2048: "bg-amber-400 text-white font-black",
};

const Game2048 = () => {
  const { user } = useAuth();
  const { saveScore, resetSaver } = useScoreSaver();
  const [board, setBoard] = useState<Board>(() => addRandom(addRandom(emptyBoard())));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const move = useCallback((dir: "left" | "right" | "up" | "down") => {
    if (gameOver) return;
    let rotations = dir === "left" ? 0 : dir === "down" ? 1 : dir === "right" ? 2 : 3;
    let b = board;
    for (let i = 0; i < rotations; i++) b = rotate90(b);
    const { board: moved, scored } = moveLeft(b);
    for (let i = 0; i < (4 - rotations) % 4; i++) b = rotate90(moved), moved.length; // just reassign
    let result = moved;
    for (let i = 0; i < (4 - rotations) % 4; i++) result = rotate90(result);

    if (boardsEqual(board, result)) return;
    const withNew = addRandom(result);
    const newScore = score + scored;
    setBoard(withNew);
    setScore(newScore);

    if (withNew.some(r => r.some(v => v === 2048)) && !won) setWon(true);
    if (!canMove(withNew)) setGameOver(true);
  }, [board, score, gameOver, won]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, "left" | "right" | "up" | "down"> = {
        ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
        a: "left", d: "right", w: "up", s: "down",
      };
      if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [move]);

  useEffect(() => {
    if (gameOver && score > 0 && user) {
      saveScore({ gameSlug: "2048", score });
    }
  }, [gameOver]);

  const restart = () => {
    resetSaver();
    setBoard(addRandom(addRandom(emptyBoard())));
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="container max-w-md py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/games"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <h1 className="font-display text-2xl font-bold tracking-wider">2048</h1>
          <div className="ml-auto font-display text-lg text-primary">{score}</div>
        </div>

        <div className="bg-muted rounded-xl p-3 mb-4">
          <div className="grid grid-cols-4 gap-2">
            {board.flat().map((val, i) => (
              <motion.div
                key={i}
                initial={val ? { scale: 0.8 } : false}
                animate={{ scale: 1 }}
                className={`aspect-square rounded-lg flex items-center justify-center font-display font-bold text-lg ${
                  val === 0 ? "bg-muted-foreground/10" : TILE_COLORS[val] || "bg-amber-600 text-white"
                }`}
              >
                {val > 0 ? val : ""}
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mb-4">Use arrow keys or WASD to slide tiles</p>

        {gameOver && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-6 rounded-xl border border-border bg-card">
            <h2 className="font-display text-2xl font-bold text-neon-orange mb-2">{won ? "YOU WIN!" : "GAME OVER"}</h2>
            <p className="font-display text-3xl font-bold text-primary mb-4">{score} pts</p>
            <Button onClick={restart} className="gradient-neon glow-blue font-display gap-2"><RotateCcw className="h-4 w-4" /> PLAY AGAIN</Button>
          </motion.div>
        )}

        {!gameOver && (
          <div className="flex justify-center">
            <Button onClick={restart} variant="outline" size="sm" className="font-display gap-2"><RotateCcw className="h-4 w-4" /> RESTART</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game2048;
