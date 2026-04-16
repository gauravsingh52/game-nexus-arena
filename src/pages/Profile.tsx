import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Trophy, Gamepad2, Calendar, Edit2, Save, X, Share2, Star, Target, Clock, Camera, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getLevelInfo, getNextLevel } from "@/lib/levels";
import { gamesData } from "@/data/games";

interface Profile {
  username: string;
  bio: string;
  level: string;
  total_points: number;
  created_at: string;
  avatar_url: string | null;
}

interface ScoreRow {
  game_slug: string;
  score: number;
  accuracy: number | null;
  created_at: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [badges, setBadges] = useState<{ name: string; icon: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, scoresRes, achRes] = await Promise.all([
        supabase.from("profiles").select("username, bio, level, total_points, created_at, avatar_url").eq("id", user.id).maybeSingle(),
        supabase.from("scores").select("game_slug, score, accuracy, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100),
        supabase.from("user_achievements").select("achievements(name, icon)").eq("user_id", user.id),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (scoresRes.data) setScores(scoresRes.data);
      if (achRes.data) {
        setBadges(achRes.data.map((a: any) => ({ name: a.achievements?.name ?? "", icon: a.achievements?.icon ?? "" })));
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const startEdit = () => { setEditUsername(profile?.username || ""); setEditBio(profile?.bio || ""); setEditing(true); };
  const cancelEdit = () => setEditing(false);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      username: editUsername.trim() || "Player",
      bio: editBio.trim(),
    }).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error("Failed to save profile"); }
    else {
      setProfile(prev => prev ? { ...prev, username: editUsername.trim() || "Player", bio: editBio.trim() } : prev);
      setEditing(false);
      toast.success("Profile updated!");
    }
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) { toast.error("Upload failed"); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = urlData.publicUrl + "?t=" + Date.now();
    await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", user.id);
    setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : prev);
    setUploading(false);
    toast.success("Avatar updated!");
  };

  const shareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied!");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalPoints = profile?.total_points ?? 0;
  const lvl = getLevelInfo(totalPoints);
  const next = getNextLevel(totalPoints);
  const gamesPlayed = scores.length;
  const uniqueGames = new Set(scores.map(s => s.game_slug)).size;

  // Favorite game
  const gameCounts = scores.reduce<Record<string, number>>((acc, s) => { acc[s.game_slug] = (acc[s.game_slug] || 0) + 1; return acc; }, {});
  const favoriteSlug = Object.entries(gameCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const favoriteGame = gamesData.find(g => g.id === favoriteSlug);

  // Top 3 best scores
  const bestScores = [...scores].sort((a, b) => b.score - a.score).slice(0, 3);

  // Average accuracy
  const accScores = scores.filter(s => s.accuracy != null);
  const avgAccuracy = accScores.length > 0 ? Math.round(accScores.reduce((a, s) => a + (s.accuracy ?? 0), 0) / accScores.length) : null;

  // Activity heatmap (last 30 days)
  const now = new Date();
  const heatmap = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const count = scores.filter(s => s.created_at.slice(0, 10) === dateStr).length;
    return { date: dateStr, count, day: d.toLocaleDateString("en-US", { weekday: "short" }).charAt(0) };
  });

  // Member since
  const joinDate = profile ? new Date(profile.created_at) : new Date();
  const monthsDiff = Math.max(1, Math.floor((now.getTime() - joinDate.getTime()) / (30 * 24 * 60 * 60 * 1000)));

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header Card */}
          <Card className="bg-card border-border mb-6 overflow-hidden">
            <div className="h-24 gradient-neon opacity-30" />
            <CardContent className="relative pt-0 -mt-12 px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Avatar */}
                <div className="relative group">
                  <div className="h-20 w-20 rounded-full bg-muted border-4 border-card flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
                  {uploading && <div className="absolute inset-0 rounded-full bg-background/60 flex items-center justify-center"><div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}
                </div>

                <div className="flex-1">
                  {editing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Username</label>
                        <Input value={editUsername} onChange={e => setEditUsername(e.target.value)} className="font-display" maxLength={30} />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Bio</label>
                        <Textarea value={editBio} onChange={e => setEditBio(e.target.value)} className="resize-none" rows={2} maxLength={160} />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={saveProfile} disabled={saving} size="sm" className="gradient-neon font-display gap-1">
                          <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save"}
                        </Button>
                        <Button onClick={cancelEdit} variant="outline" size="sm" className="font-display gap-1">
                          <X className="h-3.5 w-3.5" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h1 className="font-display text-2xl font-bold tracking-wider">{profile?.username ?? "PLAYER"}</h1>
                        <Badge className="gradient-neon text-xs">{lvl.badge} {lvl.level}</Badge>
                        <Button onClick={startEdit} variant="ghost" size="icon" className="h-7 w-7 ml-1">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button onClick={shareProfile} variant="ghost" size="icon" className="h-7 w-7">
                          <Share2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{profile?.bio || "No bio yet. Click edit to add one!"}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5 text-neon-orange" /> {totalPoints.toLocaleString()} pts</span>
                        <span className="flex items-center gap-1"><Gamepad2 className="h-3.5 w-3.5 text-neon-blue" /> {gamesPlayed} games</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-neon-green" /> Member for {monthsDiff} month{monthsDiff !== 1 ? "s" : ""}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Level Progress */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-xs tracking-wider">LEVEL PROGRESS</span>
                <span className="text-xs text-muted-foreground">
                  {next ? `${next.pointsNeeded.toLocaleString()} pts to ${next.name}` : "Max level!"}
                </span>
              </div>
              <Progress value={lvl.progress} className="h-3" />
              <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                <span>{lvl.level}</span>
                <span>{Math.round(lvl.progress)}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Points", value: totalPoints.toLocaleString(), color: "text-neon-orange", icon: Trophy },
              { label: "Games Played", value: gamesPlayed.toString(), color: "text-neon-green", icon: Gamepad2 },
              { label: "Unique Games", value: uniqueGames.toString(), color: "text-neon-blue", icon: Target },
              { label: "Avg Accuracy", value: avgAccuracy != null ? `${avgAccuracy}%` : "N/A", color: "text-neon-pink", icon: TrendingUp },
            ].map((s) => (
              <Card key={s.label} className="bg-card border-border text-center p-4">
                <s.icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} />
                <p className={`font-display text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
              </Card>
            ))}
          </div>

          {/* Favorite Game + Top Scores Row */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {/* Favorite Game */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <h2 className="font-display text-xs tracking-wider mb-3 flex items-center gap-1"><Star className="h-3.5 w-3.5 text-neon-orange" /> FAVORITE GAME</h2>
                {favoriteGame ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{favoriteGame.icon}</span>
                    <div>
                      <p className="font-heading font-semibold">{favoriteGame.name}</p>
                      <p className="text-xs text-muted-foreground">{gameCounts[favoriteSlug!]} plays</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Play some games to find your favorite!</p>
                )}
              </CardContent>
            </Card>

            {/* Top 3 Best Scores */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <h2 className="font-display text-xs tracking-wider mb-3 flex items-center gap-1"><Trophy className="h-3.5 w-3.5 text-neon-orange" /> TOP SCORES</h2>
                {bestScores.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No scores yet!</p>
                ) : (
                  <div className="space-y-2">
                    {bestScores.map((s, i) => {
                      const game = gamesData.find(g => g.id === s.game_slug);
                      return (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span>{["🥇", "🥈", "🥉"][i]}</span>
                            <span className="font-heading">{game?.name ?? s.game_slug}</span>
                          </span>
                          <span className="font-mono font-bold text-primary">{s.score}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity Heatmap */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-4">
              <h2 className="font-display text-xs tracking-wider mb-3 flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-neon-blue" /> ACTIVITY (LAST 30 DAYS)</h2>
              <div className="flex gap-1 flex-wrap">
                {heatmap.map((d) => (
                  <div
                    key={d.date}
                    title={`${d.date}: ${d.count} games`}
                    className={`w-4 h-4 rounded-sm border border-border ${
                      d.count === 0 ? "bg-muted/30" :
                      d.count <= 2 ? "bg-neon-green/30" :
                      d.count <= 5 ? "bg-neon-green/60" : "bg-neon-green"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-muted/30 border border-border" />
                <div className="w-3 h-3 rounded-sm bg-neon-green/30" />
                <div className="w-3 h-3 rounded-sm bg-neon-green/60" />
                <div className="w-3 h-3 rounded-sm bg-neon-green" />
                <span>More</span>
              </div>
            </CardContent>
          </Card>

          {/* Game History */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-4">
              <h2 className="font-display text-xs tracking-wider mb-3">RECENT GAME HISTORY</h2>
              {scores.length === 0 ? (
                <p className="text-sm text-muted-foreground">No games played yet!</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {scores.slice(0, 15).map((s, i) => {
                    const game = gamesData.find(g => g.id === s.game_slug);
                    return (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{game?.icon ?? "🎮"}</span>
                          <div>
                            <p className="font-heading text-sm font-semibold">{game?.name ?? s.game_slug}</p>
                            <p className="text-[10px] text-muted-foreground">{new Date(s.created_at).toLocaleDateString()} · {new Date(s.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-sm font-bold text-primary">{s.score}</span>
                          {s.accuracy != null && <p className="text-[10px] text-muted-foreground">{s.accuracy}% acc</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <h2 className="font-display text-xs tracking-wider mb-3">BADGES</h2>
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
