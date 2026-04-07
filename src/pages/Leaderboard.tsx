import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

type Tab = "global" | "weekly" | "game";

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  level: string;
}

const GAME_SLUGS = [
  { slug: "memory-match", name: "Memory Match" },
  { slug: "speed-typer", name: "Speed Typer" },
  { slug: "quiz-challenge", name: "Quiz Challenge" },
  { slug: "reaction-time", name: "Reaction Time" },
  { slug: "math-blitz", name: "Math Blitz" },
  { slug: "snake", name: "Snake" },
  { slug: "whack-a-mole", name: "Whack-a-Mole" },
  { slug: "color-match", name: "Color Match" },
  { slug: "word-scramble", name: "Word Scramble" },
  { slug: "aim-trainer", name: "Aim Trainer" },
];

const rankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-neon-orange" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-foreground/60" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-neon-orange/60" />;
  return <span className="text-sm text-muted-foreground font-mono w-5 text-center">{rank}</span>;
};

const Leaderboard = () => {
  const [tab, setTab] = useState<Tab>("global");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(GAME_SLUGS[0].slug);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      let result: LeaderboardEntry[] = [];

      if (tab === "global") {
        const { data } = await supabase
          .from("profiles")
          .select("id, username, total_points, level")
          .order("total_points", { ascending: false })
          .limit(20);
        if (data) {
          result = data.map((p, i) => ({
            rank: i + 1,
            username: p.username ?? "Anonymous",
            points: p.total_points ?? 0,
            level: p.level ?? "Beginner",
          }));
        }
      } else if (tab === "weekly") {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data } = await supabase
          .from("scores")
          .select("user_id, score, profiles!inner(username, level)")
          .gte("created_at", weekAgo)
          .order("score", { ascending: false })
          .limit(50);
        if (data) {
          const userMap = new Map<string, { username: string; level: string; total: number }>();
          data.forEach((s: any) => {
            const existing = userMap.get(s.user_id);
            const username = s.profiles?.username ?? "Anonymous";
            const level = s.profiles?.level ?? "Beginner";
            if (existing) {
              existing.total += s.score;
            } else {
              userMap.set(s.user_id, { username, level, total: s.score });
            }
          });
          result = Array.from(userMap.values())
            .sort((a, b) => b.total - a.total)
            .slice(0, 20)
            .map((u, i) => ({ rank: i + 1, username: u.username, points: u.total, level: u.level }));
        }
      } else {
        const { data } = await supabase
          .from("scores")
          .select("user_id, score, profiles!inner(username, level)")
          .eq("game_slug", selectedGame)
          .order("score", { ascending: false })
          .limit(20);
        if (data) {
          result = data.map((s: any, i: number) => ({
            rank: i + 1,
            username: s.profiles?.username ?? "Anonymous",
            points: s.score,
            level: s.profiles?.level ?? "Beginner",
          }));
        }
      }

      setEntries(result);
      setLoading(false);
    };
    fetchLeaderboard();
  }, [tab, selectedGame]);

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

        <div className="flex gap-2 mb-6 flex-wrap items-center">
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
          {tab === "game" && (
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="w-[180px] h-9 bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GAME_SLUGS.map(g => (
                  <SelectItem key={g.slug} value={g.slug}>{g.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-heading">No players yet. Be the first to play!</p>
          </div>
        ) : (
          <>
            {entries.length >= 3 && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[1, 0, 2].map((idx) => {
                  const player = entries[idx];
                  if (!player) return null;
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
                      <Badge variant="outline" className="mt-2 border-primary/30 text-primary text-xs">{player.level}</Badge>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {entries.slice(3).map((player, i) => (
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
                    <p className="text-xs text-muted-foreground">{player.level}</p>
                  </div>
                  <p className="font-mono text-sm font-semibold">{player.points.toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
