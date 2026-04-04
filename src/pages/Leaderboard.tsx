import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Tab = "global" | "weekly" | "game";

const mockLeaderboard = Array.from({ length: 20 }, (_, i) => ({
  rank: i + 1,
  username: ["NeonBlade", "PixelQueen", "ShadowFox", "CyberNova", "StormRider", "VoidWalker", "BlazeMaster", "IcePhoenix", "ThunderBolt", "StarForge", "DarkMatter", "QuantumLeap", "FireStorm", "GhostRider", "NightHawk", "IronWolf", "SilverShade", "GoldRush", "DiamondEdge", "PlatinumStar"][i],
  points: Math.floor(50000 - i * 2300 + Math.random() * 500),
  level: Math.max(1, 20 - i),
  change: Math.floor(Math.random() * 5) - 2,
}));

const rankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-neon-orange" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-foreground/60" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-neon-orange/60" />;
  return <span className="text-sm text-muted-foreground font-mono w-5 text-center">{rank}</span>;
};

const Leaderboard = () => {
  const [tab, setTab] = useState<Tab>("global");

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-neon-orange" />
            <h1 className="font-display text-3xl font-bold tracking-wider">LEADERBOARD</h1>
          </div>
          <p className="text-muted-foreground mb-6">Top players ranked by total points</p>
        </motion.div>

        <div className="flex gap-2 mb-6">
          {(["global", "weekly", "game"] as Tab[]).map((t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(t)}
              className={`font-heading capitalize ${tab === t ? "gradient-neon" : "border-border"}`}
            >
              {t === "game" ? "By Game" : t}
            </Button>
          ))}
        </div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[1, 0, 2].map((idx) => {
            const player = mockLeaderboard[idx];
            const isFirst = idx === 0;
            return (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`text-center p-4 rounded-xl border bg-card ${
                  isFirst ? "border-neon-orange/40 glow-blue order-2" : "border-border order-" + (idx === 1 ? "1" : "3")
                }`}
              >
                <div className="text-3xl mb-2">{isFirst ? "👑" : idx === 1 ? "🥈" : "🥉"}</div>
                <p className="font-display text-sm font-bold tracking-wider">{player.username}</p>
                <p className="text-xs text-muted-foreground mt-1">{player.points.toLocaleString()} pts</p>
                <Badge variant="outline" className="mt-2 border-primary/30 text-primary text-xs">
                  Lvl {player.level}
                </Badge>
              </motion.div>
            );
          })}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {mockLeaderboard.slice(3).map((player, i) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <div className="w-8 flex justify-center">{rankIcon(player.rank)}</div>
              <div className="flex-1">
                <p className="font-heading text-sm font-semibold">{player.username}</p>
                <p className="text-xs text-muted-foreground">Level {player.level}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold">{player.points.toLocaleString()}</p>
                <div className="flex items-center gap-1 justify-end">
                  {player.change > 0 && <TrendingUp className="h-3 w-3 text-neon-green" />}
                  {player.change < 0 && <TrendingUp className="h-3 w-3 text-destructive rotate-180" />}
                  <span className={`text-xs ${player.change > 0 ? "text-neon-green" : player.change < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                    {player.change > 0 ? `+${player.change}` : player.change === 0 ? "—" : player.change}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
