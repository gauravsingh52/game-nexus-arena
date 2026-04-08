import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Gamepad2, Target, Flame, TrendingUp, Award, Zap, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { gamesData } from "@/data/games";

interface Profile {
  username: string;
  level: string;
  total_points: number;
}

interface Score {
  game_slug: string;
  score: number;
  completion_time: number | null;
  created_at: string;
}

interface Achievement {
  name: string;
  icon: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [allAchievements, setAllAchievements] = useState<{ name: string; icon: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, scoresRes, userAchRes, achRes] = await Promise.all([
        supabase.from("profiles").select("username, level, total_points").eq("id", user.id).maybeSingle(),
        supabase.from("scores").select("game_slug, score, completion_time, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
        supabase.from("user_achievements").select("achievement_id, achievements(name, icon)").eq("user_id", user.id),
        supabase.from("achievements").select("name, icon"),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (scoresRes.data) setScores(scoresRes.data);
      if (userAchRes.data) {
        const unlocked = userAchRes.data.map((ua: any) => ({
          name: ua.achievements?.name ?? "",
          icon: ua.achievements?.icon ?? "",
        }));
        setAchievements(unlocked);
      }
      if (achRes.data) setAllAchievements(achRes.data);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalPoints = profile?.total_points ?? 0;
  const gamesPlayed = scores.length;
  const uniqueGames = new Set(scores.map((s) => s.game_slug)).size;
  const avgScore = gamesPlayed > 0 ? Math.round(scores.reduce((a, b) => a + b.score, 0) / gamesPlayed) : 0;
  const bestScore = gamesPlayed > 0 ? Math.max(...scores.map(s => s.score)) : 0;

  const chartData = scores.slice(0, 10).reverse().map((s) => ({
    day: new Date(s.created_at).toLocaleDateString("en-US", { weekday: "short" }),
    points: s.score,
  }));

  const recentGames = scores.slice(0, 5);
  const unlockedNames = new Set(achievements.map((a) => a.name));

  const statCards = [
    { label: "Total Points", value: totalPoints.toLocaleString(), icon: Trophy, color: "text-neon-orange", bg: "from-neon-orange/10 to-transparent" },
    { label: "Games Played", value: gamesPlayed, icon: Gamepad2, color: "text-neon-purple", bg: "from-neon-purple/10 to-transparent" },
    { label: "Unique Games", value: uniqueGames, icon: Target, color: "text-neon-green", bg: "from-neon-green/10 to-transparent" },
    { label: "Best Score", value: bestScore, icon: Zap, color: "text-neon-blue", bg: "from-neon-blue/10 to-transparent" },
  ];

  const quickPlayGames = gamesData.slice(0, 6);

  return (
    <div className="min-h-screen pt-16">
      {/* Gradient Header */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="container relative py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-2">
              <div className="h-14 w-14 rounded-2xl gradient-neon glow-blue flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold tracking-wider">DASHBOARD</h1>
                <p className="text-muted-foreground">Welcome back, <span className="text-primary font-semibold">{profile?.username ?? "Player"}</span></p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card border-border group hover:border-primary/30 transition-all duration-300 overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${s.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <CardContent className="p-5 relative">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-muted group-hover:scale-110 transition-transform">
                      <s.icon className={`h-6 w-6 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="font-display text-2xl font-bold">{s.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Play */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm tracking-wider flex items-center gap-2">
              <Play className="h-4 w-4 text-primary" /> QUICK PLAY
            </h2>
            <Link to="/games">
              <Button variant="ghost" size="sm" className="text-xs font-display text-muted-foreground">View All →</Button>
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {quickPlayGames.map(game => (
              <Link key={game.id} to={game.route}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="text-center p-3 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors cursor-pointer"
                >
                  <span className="text-2xl block mb-1">{game.icon}</span>
                  <p className="text-[10px] font-display tracking-wider truncate">{game.name}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-sm tracking-wider flex items-center gap-2">
                <Award className="h-4 w-4 text-neon-blue" /> LEVEL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="font-heading text-lg font-bold">{profile?.level ?? "Beginner"}</span>
              <p className="text-xs text-muted-foreground mt-1">Keep playing to level up!</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-sm tracking-wider flex items-center gap-2">
                <Flame className="h-4 w-4 text-neon-orange" /> AVERAGE SCORE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="font-display text-4xl font-black text-neon-orange">{avgScore}</span>
              <span className="text-muted-foreground text-sm ml-2">pts per game</span>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <CardTitle className="font-display text-sm tracking-wider flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> RECENT SCORES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Area type="monotone" dataKey="points" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#scoreGrad)" dot={{ fill: "hsl(var(--primary))" }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-sm tracking-wider">RECENT GAMES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentGames.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No games played yet. Start playing!</p>
              ) : (
                recentGames.map((g, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{gamesData.find(gd => gd.id === g.game_slug)?.icon ?? "🎮"}</span>
                      <div>
                        <p className="font-heading text-sm font-semibold">{g.game_slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                        <p className="text-xs text-muted-foreground">{new Date(g.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-primary">{g.score}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-sm tracking-wider">ACHIEVEMENTS</CardTitle>
            </CardHeader>
            <CardContent>
              {allAchievements.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No achievements available yet.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {allAchievements.map((a) => (
                    <div
                      key={a.name}
                      className={`text-center p-3 rounded-lg border ${
                        unlockedNames.has(a.name) ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30 opacity-40"
                      }`}
                    >
                      <span className="text-2xl">{a.icon}</span>
                      <p className="text-xs font-heading mt-1">{a.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
