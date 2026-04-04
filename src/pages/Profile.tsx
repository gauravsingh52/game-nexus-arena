import { motion } from "framer-motion";
import { User, Trophy, Gamepad2, Calendar, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile Header */}
          <Card className="bg-card border-border mb-6 overflow-hidden">
            <div className="h-24 gradient-neon opacity-30" />
            <CardContent className="relative pt-0 -mt-12 px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="h-20 w-20 rounded-full bg-muted border-4 border-card flex items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-display text-2xl font-bold tracking-wider">PLAYER</h1>
                    <Badge className="gradient-neon text-xs">Level 8</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Casual gamer who loves puzzles and strategy games.</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5 text-neon-orange" /> Rank #42</span>
                    <span className="flex items-center gap-1"><Gamepad2 className="h-3.5 w-3.5 text-neon-blue" /> 87 games</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-neon-green" /> Joined 2025</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-border font-heading gap-1">
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Points", value: "12,450", color: "text-neon-orange" },
              { label: "Win Rate", value: "72%", color: "text-neon-green" },
              { label: "Best Streak", value: "12 days", color: "text-neon-pink" },
            ].map((s) => (
              <Card key={s.label} className="bg-card border-border text-center p-4">
                <p className={`font-display text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </Card>
            ))}
          </div>

          {/* Badges */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h2 className="font-display text-sm tracking-wider mb-4">BADGES</h2>
              <div className="flex flex-wrap gap-3">
                {["🏆 First Win", "⚡ Speed Demon", "🔥 7-Day Streak", "🧩 Puzzle Pro"].map((b) => (
                  <Badge key={b} variant="outline" className="border-primary/30 bg-primary/5 text-sm py-1.5 px-3">
                    {b}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
