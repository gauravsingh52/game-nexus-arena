export type GameCategory = "puzzle" | "arcade" | "strategy" | "action";
export type GameDifficulty = "easy" | "medium" | "hard";

export interface GameData {
  id: string;
  name: string;
  description: string;
  category: GameCategory;
  difficulty: GameDifficulty;
  rating: number;
  popularity: number;
  icon: string;
  color: string;
  route: string;
}

export const gamesData: GameData[] = [
  {
    id: "memory-match",
    name: "Memory Match",
    description: "Flip cards and find matching pairs before time runs out. Test your memory!",
    category: "puzzle",
    difficulty: "easy",
    rating: 4.5,
    popularity: 2450,
    icon: "🧠",
    color: "neon-blue",
    route: "/games/memory-match",
  },
  {
    id: "speed-typer",
    name: "Speed Typer",
    description: "Type the words as fast as you can! Race against the clock in this typing challenge.",
    category: "arcade",
    difficulty: "medium",
    rating: 4.3,
    popularity: 1890,
    icon: "⌨️",
    color: "neon-purple",
    route: "/games/speed-typer",
  },
  {
    id: "quiz-challenge",
    name: "Quiz Challenge",
    description: "Answer trivia questions with increasing difficulty. How far can you go?",
    category: "strategy",
    difficulty: "medium",
    rating: 4.7,
    popularity: 3200,
    icon: "🧩",
    color: "neon-green",
    route: "/games/quiz-challenge",
  },
  {
    id: "reaction-time",
    name: "Reaction Time",
    description: "Test your reflexes! Click the targets as fast as possible when they appear.",
    category: "action",
    difficulty: "easy",
    rating: 4.1,
    popularity: 2100,
    icon: "⚡",
    color: "neon-orange",
    route: "/games/reaction-time",
  },
  {
    id: "math-blitz",
    name: "Math Blitz",
    description: "Solve math problems against the clock. Speed and accuracy both count!",
    category: "puzzle",
    difficulty: "hard",
    rating: 4.6,
    popularity: 1650,
    icon: "🔢",
    color: "neon-pink",
    route: "/games/math-blitz",
  },
];

export const categoryLabels: Record<GameCategory, string> = {
  puzzle: "Puzzle",
  arcade: "Arcade",
  strategy: "Strategy",
  action: "Action",
};

export const difficultyLabels: Record<GameDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};
