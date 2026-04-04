import { motion } from "framer-motion";
import { Trophy, Gamepad2, Target, Flame, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const mockStats = {
  totalPoints: 12450,
  rank: 42,
  level: 8,
  levelProgress: 65,
  gamesPlayed: 87,
  winRate: 72,
  streak: 5,
};

const mockHistory = [
  { day: "Mon", points: 450 },
  { day: "Tue", points: 680 },
  { day: "Wed", points: 520 },
  { day: "Thu", points: 890 },
  { day: "Fri", points: 750 },
  { day: "Sat", points: 1100 },
  { day: "Sun", points: 940 },
];

const mockAchievements = [
  { name: "First Win", icon: "🏆", unlocked: true },
  { name: "Speed Demon", icon: "⚡", unlocked: true },
  { name: "Top 10", icon: "🥇", unlocked: false },
  { name: "7-Day Streak", icon: "🔥", unlocked: true },
  { name: "Game Master", icon: "👑", unlocked: false },
  { name: "Puzzle Pro", icon: "🧩", unlocked: true },
];

const recentGames = [
  { game: "Memory Match", score: 850, time: "2m 15s", date: "Today" },
  { game: "Speed Typer", score: 1200, time: "1m 30s", date: "Today" },
  { game: "Quiz Challenge", score: 950, time: "3m 45s", date: "Yesterday" },
  { game: "Math Blitz", score: 1100, time: "2m 00s", date: "Yesterday" },
];

const statCards = [
  { label: "Total Points", value: mockStats.totalPoints.toLocaleString(), icon: Trophy, color: "text-neon-orange" },
  { label: "Global Rank", value: `#${mockStats.rank}`, icon: TrendingUp, color: "text-neon-blue" },
  { label: "Games Played", value: mockStats.gamesPlayed, icon: Gamepad2, color: "text-neon-purple" },
  { label: "Win Rate", value: `${mockStats.winRate}%`, icon: Target, color: "text-neon-green" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold tracking-wider mb-2">DASHBOARD</h1>
          <p className="text-muted-foreground mb-6">Your gaming performance at a glance</p>
        </motion.div>

        {/* Stats Grid */}
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

        {/* Level & Streak */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-sm tracking-wider flex items-center gap-2">
                <Award className="h-4 w-4 text-neon-blue" /> LEVEL PROGRESS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading text-lg font-bold">Level {mockStats.level}</span>
                <span className="text-xs text-muted-foreground">{mockStats.levelProgress}%</span>
              </div>
              <Progress value={mockStats.levelProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">350 pts to Level {mockStats.level + 1}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-sm tracking-wider flex items-center gap-2">
                <Flame className="h-4 w-4 text-neon-orange" /> CURRENT STREAK
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="font-display text-4xl font-black text-neon-orange">{mockStats.streak}</span>
                <span className="text-muted-foreground text-sm">days in a row!</span>
              </div>
              <div className="flex gap-1 mt-3">
                {Array.from({ length: 7 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-3 flex-1 rounded-sm ${i < mockStats.streak ? "bg-neon-orange" : "bg-muted"}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="font-display text-sm tracking-wider">POINTS THIS WEEK</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 16%)" />
                <XAxis dataKey="day" tick={{ fill: "hsl(220 10% 55%)", fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: "hsl(220 10% 55%)", fontSize: 12 }} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(240 12% 8%)", border: "1px solid hsl(240 10% 16%)", borderRadius: 8 }}
                  labelStyle={{ color: "hsl(220 20% 92%)" }}
                />
                <Line type="monotone" dataKey="points" stroke="hsl(220 90% 56%)" strokeWidth={2} dot={{ fill: "hsl(220 90% 56%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Recent Games */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-sm tracking-wider">RECENT GAMES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentGames.map((g, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-heading text-sm font-semibold">{g.game}</p>
                    <p className="text-xs text-muted-foreground">{g.date} • {g.time}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-primary">{g.score}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-sm tracking-wider">ACHIEVEMENTS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {mockAchievements.map((a) => (
                  <div
                    key={a.name}
                    className={`text-center p-3 rounded-lg border ${
                      a.unlocked ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30 opacity-40"
                    }`}
                  >
                    <span className="text-2xl">{a.icon}</span>
                    <p className="text-xs font-heading mt-1">{a.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
