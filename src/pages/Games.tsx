import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GameCard from "@/components/GameCard";
import { gamesData, categoryLabels, difficultyLabels, GameCategory, GameDifficulty } from "@/data/games";

const categories: (GameCategory | "all")[] = ["all", "puzzle", "arcade", "strategy", "action"];
const difficulties: (GameDifficulty | "all")[] = ["all", "easy", "medium", "hard"];
const sortOptions = ["popular", "rating", "name"] as const;

const Games = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<GameCategory | "all">("all");
  const [difficulty, setDifficulty] = useState<GameDifficulty | "all">("all");
  const [sort, setSort] = useState<typeof sortOptions[number]>("popular");

  const filtered = useMemo(() => {
    let g = gamesData.filter((game) => {
      if (search && !game.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "all" && game.category !== category) return false;
      if (difficulty !== "all" && game.difficulty !== difficulty) return false;
      return true;
    });
    if (sort === "popular") g.sort((a, b) => b.popularity - a.popularity);
    if (sort === "rating") g.sort((a, b) => b.rating - a.rating);
    if (sort === "name") g.sort((a, b) => a.name.localeCompare(b.name));
    return g;
  }, [search, category, difficulty, sort]);

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold tracking-wider mb-2">
            GAME <span className="text-primary">LIBRARY</span>
          </h1>
          <p className="text-muted-foreground mb-6">Browse and play our collection of mini-games</p>
        </motion.div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-muted border-border"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 mr-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
            {categories.map((c) => (
              <Button
                key={c}
                variant={category === c ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(c)}
                className={`font-heading text-xs ${category === c ? "gradient-neon" : "border-border"}`}
              >
                {c === "all" ? "All" : categoryLabels[c]}
              </Button>
            ))}
            <div className="w-px bg-border mx-1" />
            {difficulties.map((d) => (
              <Button
                key={d}
                variant={difficulty === d ? "default" : "outline"}
                size="sm"
                onClick={() => setDifficulty(d)}
                className={`font-heading text-xs ${difficulty === d ? "gradient-neon" : "border-border"}`}
              >
                {d === "all" ? "All Levels" : difficultyLabels[d]}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            {sortOptions.map((s) => (
              <Badge
                key={s}
                variant={sort === s ? "default" : "outline"}
                className={`cursor-pointer ${sort === s ? "bg-primary/20 text-primary border-primary/30" : "border-border"}`}
                onClick={() => setSort(s)}
              >
                {s === "popular" ? "Most Popular" : s === "rating" ? "Top Rated" : "A-Z"}
              </Badge>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GameCard game={game} />
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="font-display text-lg">No games found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
