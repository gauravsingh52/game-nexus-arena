import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GameData, categoryLabels, difficultyLabels } from "@/data/games";

const difficultyColor: Record<string, string> = {
  easy: "bg-neon-green/20 text-neon-green border-neon-green/30",
  medium: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  hard: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
};

const GameCard = ({ game }: { game: GameData }) => {
  return (
    <Link to={game.route}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:glow-blue cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4">
          <span className="text-4xl">{game.icon}</span>
          <Badge variant="outline" className={difficultyColor[game.difficulty]}>
            {difficultyLabels[game.difficulty]}
          </Badge>
        </div>

        <h3 className="font-display text-lg font-bold text-foreground mb-1 tracking-wide">
          {game.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{game.description}</p>

        <div className="flex items-center justify-between text-sm">
          <Badge variant="outline" className="border-border text-muted-foreground">
            {categoryLabels[game.category]}
          </Badge>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-neon-orange fill-neon-orange" />
              {game.rating}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {game.popularity.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </motion.div>
    </Link>
  );
};

export default GameCard;
