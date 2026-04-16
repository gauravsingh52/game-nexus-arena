import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight as ArrowRightIcon, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useScoreSaver } from "@/hooks/useScoreSaver";

type Pos = { x: number; y: number };
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID = 20;
const CELL = 20;
const INITIAL_SPEED = 150;

const SnakeGame = () => {
  const [snake, setSnake] = useState<Pos[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Pos>({ x: 15, y: 10 });
  const [dir, setDir] = useState<Dir>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const dirRef = useRef<Dir>("RIGHT");
  const gameLoopRef = useRef<number>();
  const { saveScore, resetSaver } = useScoreSaver();

  const spawnFood = useCallback((snk: Pos[]): Pos => {
    let pos: Pos;
    do {
      pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (snk.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  }, []);

  useEffect(() => {
    if (gameOver && score > 0) {
      saveScore({ gameSlug: "snake-game", score: score * 10 });
    }
  }, [gameOver]);

  const reset = () => {
    const s = [{ x: 10, y: 10 }];
    setSnake(s);
    setFood(spawnFood(s));
    setDir("RIGHT");
    dirRef.current = "RIGHT";
    setGameOver(false);
    setScore(0);
    setPlaying(true);
    resetSaver();
  };

  const tick = useCallback(() => {
    setSnake(prev => {
      const head = { ...prev[0] };
      const d = dirRef.current;
      if (d === "UP") head.y--;
      if (d === "DOWN") head.y++;
      if (d === "LEFT") head.x--;
      if (d === "RIGHT") head.x++;

      if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID || prev.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        setPlaying(false);
        setHighScore(h => Math.max(h, prev.length - 1));
        return prev;
      }

      const newSnake = [head, ...prev];
      if (head.x === food.x && head.y === food.y) {
        setScore(prev.length);
        setFood(spawnFood(newSnake));
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  }, [food, spawnFood]);

  useEffect(() => {
    if (!playing) return;
    const speed = Math.max(60, INITIAL_SPEED - score * 3);
    gameLoopRef.current = window.setInterval(tick, speed);
    return () => clearInterval(gameLoopRef.current);
  }, [playing, tick, score]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = { ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT", w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT" };
      const newDir = map[e.key];
      if (!newDir) return;
      e.preventDefault();
      const opp: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      if (opp[newDir] !== dirRef.current) {
        dirRef.current = newDir;
        setDir(newDir);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-10 flex flex-col items-center">
      <div className="container max-w-lg">
        <Link to="/games" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 font-heading">
          <ArrowLeft className="h-4 w-4" /> Back to Games
        </Link>

        <h1 className="font-display text-3xl font-bold tracking-wider mb-2">🐍 SNAKE GAME</h1>
        <div className="flex items-center gap-6 mb-6 font-display text-sm tracking-wider">
          <span>SCORE: <span className="text-neon-green">{score}</span></span>
          <span>BEST: <span className="text-neon-orange">{highScore}</span></span>
        </div>

        <div
          className="relative border-2 border-border rounded-xl overflow-hidden bg-card/50 mx-auto"
          style={{ width: GRID * CELL, height: GRID * CELL }}
        >
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: "radial-gradient(circle, hsl(220 90% 56%) 1px, transparent 1px)",
            backgroundSize: `${CELL}px ${CELL}px`,
          }} />

          {snake.map((s, i) => (
            <div
              key={i}
              className={`absolute rounded-sm transition-all duration-75 ${i === 0 ? "bg-neon-green glow-green" : "bg-neon-green/70"}`}
              style={{ left: s.x * CELL, top: s.y * CELL, width: CELL - 1, height: CELL - 1 }}
            />
          ))}
          <div
            className="absolute rounded-full bg-neon-pink animate-pulse"
            style={{ left: food.x * CELL + 2, top: food.y * CELL + 2, width: CELL - 4, height: CELL - 4 }}
          />

          {!playing && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <Button onClick={reset} className="gradient-neon glow-blue font-display tracking-wider">START GAME</Button>
            </div>
          )}
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm gap-4">
              <p className="font-display text-2xl font-bold text-destructive">GAME OVER</p>
              <p className="font-display text-lg text-neon-green">Score: {score * 10} pts</p>
              <Button onClick={reset} className="gradient-neon glow-blue font-display tracking-wider gap-2">
                <RotateCcw className="h-4 w-4" /> PLAY AGAIN
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 md:hidden">
          <Button variant="outline" size="icon" onClick={() => { if (dirRef.current !== "DOWN") { dirRef.current = "UP"; setDir("UP"); } }}><ArrowUp className="h-5 w-5" /></Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => { if (dirRef.current !== "RIGHT") { dirRef.current = "LEFT"; setDir("LEFT"); } }}><ArrowLeft className="h-5 w-5" /></Button>
            <Button variant="outline" size="icon" onClick={() => { if (dirRef.current !== "UP") { dirRef.current = "DOWN"; setDir("DOWN"); } }}><ArrowDown className="h-5 w-5" /></Button>
            <Button variant="outline" size="icon" onClick={() => { if (dirRef.current !== "LEFT") { dirRef.current = "RIGHT"; setDir("RIGHT"); } }}><ArrowRightIcon className="h-5 w-5" /></Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4 font-heading">Use arrow keys or WASD to move</p>
      </div>
    </div>
  );
};

export default SnakeGame;
