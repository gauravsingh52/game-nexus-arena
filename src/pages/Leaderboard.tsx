import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { getLevelInfo } from "@/lib/levels";

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
  { slug: "snake-game", name: "Snake" },
  { slug: "whack-a-mole", name: "Whack-a-Mole" },
  { slug: "color-match", name: "Color Match" },
  { slug: "word-scramble", name: "Word Scramble" },
  { slug: "aim-trainer", name: "Aim Trainer" },
  { slug: "simon-says", name: "Simon Says" },
  { slug: "2048", name: "2048" },
  { slug: "tic-tac-toe", name: "Tic Tac Toe" },
  { slug: "hangman", name: "Hangman" },
  { slug: "number-guess", name: "Number Guess" },
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
          .gt("total_points", 0)
          .limit(50);
        if (data) {
          result = data.map((p, i) => ({
            rank: i + 1,
            username: p.username ?? "Anonymous",
            points: p.total_points ?? 0,
            level: p.level ?? getLevelInfo(p.total_points ?? 0).level,
          }));
        }
      } else if (tab === "weekly") {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data: scores } = await supabase
          .from("scores")
          .select("user_id, score")
          .gte("created_at", weekAgo);

        if (scores && scores.length > 0) {
          const userMap = new Map<string, number>();
          scores.forEach(s => {
            userMap.set(s.user_id, (userMap.get(s.user_id) || 0) + s.score);
          });

          const userIds = Array.from(userMap.keys());
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, username, level")
            .in("id", userIds);

          const profileMap = new Map(profiles?.map(p => [p.id, { username: p.username ?? "Anonymous", level: p.level ?? "Beginner" }]) ?? []);

          result = Array.from(userMap.entries())
            .map(([uid, total]) => ({
              rank: 0,
              username: profileMap.get(uid)?.username ?? "Anonymous",
              points: total,
              level: profileMap.get(uid)?.level ?? "Beginner",
            }))
            .sort((a, b) => b.points - a.points)
            .slice(0, 50)
            .map((e, i) => ({ ...e, rank: i + 1 }));
        }
      } else {
        // By game: aggregate best score per user
        const { data: scores } = await supabase
          .from("scores")
          .select("user_id, score")
          .eq("game_slug", selectedGame)
          .order("score", { ascending: false })
          .limit(200);

        if (scores && scores.length > 0) {
          // Keep best score per user
          const bestMap = new Map<string, number>();
          scores.forEach(s => {
            bestMap.set(s.user_id, Math.max(bestMap.get(s.user_id) ?? 0, s.score));
          });

          const userIds = Array.from(bestMap.keys());
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, username, level")
            .in("id", userIds);

          const profileMap = new Map(profiles?.map(p => [p.id, { username: p.username ?? "Anonymous", level: p.level ?? "Beginner" }]) ?? []);

          result = Array.from(bestMap.entries())
            .map(([uid, score]) => ({
              rank: 0,
              username: profileMap.get(uid)?.username ?? "Anonymous",
              points: score,
              level: profileMap.get(uid)?.level ?? "Beginner",
            }))
            .sort((a, b) => b.points - a.points)
            .slice(0, 50)
            .map((e, i) => ({ ...e, rank: i + 1 }));
        }
      }

      setEntries(result);
      setLoading(false);
    };
    fetchLeaderboard();
  }, [tab, selectedGame]);

  // Separate podium (top 3) and rest
  const podiumEntries = entries.slice(0, Math.min(3, entries.length));
  const restEntries = entries.length > 3 ? entries.slice(3) : [];
  const showPodium = podiumEntries.length >= 3;

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-neon-orange" />
            <h1 className="font-display text-3xl font-bold tracking-wider">LEADERBOARD</h1>
          </div>
          <p className="text-muted-foreground mb-6">Top players ranked by {tab === "game" ? "best score" : "total points"}</p>
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
            <p className="font-heading">No scores yet. Be the first to play!</p>
          </div>
        ) : (
          <>
            {/* Podium for 3+ players */}
            {showPodium && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[1, 0, 2].map((idx) => {
                  const player = podiumEntries[idx];
                  if (!player) return null;
                  const isFirst = idx === 0;
                  return (
                    <motion.div
                      key={player.rank}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`text-center p-4 rounded-xl border bg-card ${
                        isFirst ? "border-neon-orange/40 glow-blue order-2" : `border-border order-${idx === 1 ? "1" : "3"}`
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

            {/* List: show ALL entries when < 3, or entries 4+ when podium shown */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {(showPodium ? restEntries : entries).map((player, i) => (
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
