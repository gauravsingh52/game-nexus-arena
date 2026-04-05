import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Trophy, Gamepad2, Calendar, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  username: string;
  bio: string;
  level: string;
  total_points: number;
  created_at: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [badges, setBadges] = useState<{ name: string; icon: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, scoresRes, achRes] = await Promise.all([
        supabase.from("profiles").select("username, bio, level, total_points, created_at").eq("id", user.id).single(),
        supabase.from("scores").select("id").eq("user_id", user.id),
        supabase.from("user_achievements").select("achievements(name, icon)").eq("user_id", user.id),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (scoresRes.data) setGamesPlayed(scoresRes.data.length);
      if (achRes.data) {
        setBadges(achRes.data.map((a: any) => ({ name: a.achievements?.name ?? "", icon: a.achievements?.icon ?? "" })));
      }
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

  const joinYear = profile ? new Date(profile.created_at).getFullYear() : new Date().getFullYear();

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-card border-border mb-6 overflow-hidden">
            <div className="h-24 gradient-neon opacity-30" />
            <CardContent className="relative pt-0 -mt-12 px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="h-20 w-20 rounded-full bg-muted border-4 border-card flex items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-display text-2xl font-bold tracking-wider">{profile?.username ?? "PLAYER"}</h1>
                    <Badge className="gradient-neon text-xs">{profile?.level ?? "Beginner"}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{profile?.bio || "No bio yet."}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5 text-neon-orange" /> {profile?.total_points ?? 0} pts</span>
                    <span className="flex items-center gap-1"><Gamepad2 className="h-3.5 w-3.5 text-neon-blue" /> {gamesPlayed} games</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-neon-green" /> Joined {joinYear}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Points", value: (profile?.total_points ?? 0).toLocaleString(), color: "text-neon-orange" },
              { label: "Games Played", value: gamesPlayed.toString(), color: "text-neon-green" },
              { label: "Level", value: profile?.level ?? "Beginner", color: "text-neon-pink" },
            ].map((s) => (
              <Card key={s.label} className="bg-card border-border text-center p-4">
                <p className={`font-display text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </Card>
            ))}
          </div>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h2 className="font-display text-sm tracking-wider mb-4">BADGES</h2>
              {badges.length === 0 ? (
                <p className="text-sm text-muted-foreground">No badges earned yet. Start playing to unlock them!</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {badges.map((b) => (
                    <Badge key={b.name} variant="outline" className="border-primary/30 bg-primary/5 text-sm py-1.5 px-3">
                      {b.icon} {b.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
