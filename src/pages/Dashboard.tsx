import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Gamepad2, Target, Flame, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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
        supabase.from("profiles").select("username, level, total_points").eq("id", user.id).single(),
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

  const chartData = scores.slice(0, 7).reverse().map((s) => ({
    day: new Date(s.created_at).toLocaleDateString("en-US", { weekday: "short" }),
    points: s.score,
  }));

  const recentGames = scores.slice(0, 4);
  const unlockedNames = new Set(achievements.map((a) => a.name));

  const statCards = [
    { label: "Total Points", value: totalPoints.toLocaleString(), icon: Trophy, color: "text-neon-orange" },
    { label: "Games Played", value: gamesPlayed, icon: Gamepad2, color: "text-neon-purple" },
    { label: "Unique Games", value: uniqueGames, icon: Target, color: "text-neon-green" },
    { label: "Avg Score", value: avgScore, icon: TrendingUp, color: "text-neon-blue" },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold tracking-wider mb-2">DASHBOARD</h1>
          <p className="text-muted-foreground mb-6">Welcome back, {profile?.username ?? "Player"}</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <s.icon className={`h-8 w-8 ${s.color}`} />
                    <div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="font-display text-xl font-bold">{s.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

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
                <Flame className="h-4 w-4 text-neon-orange" /> ACTIVITY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="font-display text-4xl font-black text-neon-orange">{gamesPlayed}</span>
              <span className="text-muted-foreground text-sm ml-2">total games played</span>
            </CardContent>
          </Card>
        </div>

        {chartData.length > 0 && (
          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <CardTitle className="font-display text-sm tracking-wider">RECENT SCORES</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 16%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(220 10% 55%)", fontSize: 12 }} axisLine={false} />
                  <YAxis tick={{ fill: "hsl(220 10% 55%)", fontSize: 12 }} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(240 12% 8%)", border: "1px solid hsl(240 10% 16%)", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="points" stroke="hsl(220 90% 56%)" strokeWidth={2} dot={{ fill: "hsl(220 90% 56%)" }} />
                </LineChart>
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
                    <div>
                      <p className="font-heading text-sm font-semibold">{g.game_slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                      <p className="text-xs text-muted-foreground">{new Date(g.created_at).toLocaleDateString()}</p>
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
