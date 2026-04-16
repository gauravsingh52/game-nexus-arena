import { useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Search, Trophy, Swords, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useFriends } from "@/hooks/useFriends";
import { getLevelInfo } from "@/lib/levels";

const Friends = () => {
  const { friends, pending, loading, sendRequest, acceptRequest, declineRequest } = useFriends();
  const [searchName, setSearchName] = useState("");

  const handleSend = () => {
    if (searchName.trim()) {
      sendRequest(searchName);
      setSearchName("");
    }
  };

  const incomingPending = pending.filter(p => p.isIncoming);
  const outgoingPending = pending.filter(p => !p.isIncoming);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="font-display text-3xl font-bold tracking-wider">FRIENDS</h1>
          </div>

          {/* Add Friend */}
          <Card className="bg-card border-border mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm tracking-wider flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-neon-green" /> ADD FRIEND
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter username..."
                  value={searchName}
                  onChange={e => setSearchName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  className="font-heading"
                />
                <Button onClick={handleSend} className="gradient-neon font-display gap-1 shrink-0">
                  <Search className="h-4 w-4" /> Send
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Incoming Requests */}
          {incomingPending.length > 0 && (
            <Card className="bg-card border-border mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-sm tracking-wider">
                  PENDING REQUESTS ({incomingPending.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {incomingPending.map(p => (
                  <div key={p.friendshipId} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                    <div>
                      <p className="font-heading font-semibold">{p.username}</p>
                      <p className="text-xs text-muted-foreground">{p.total_points} pts · {p.level}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => acceptRequest(p.friendshipId)} className="gradient-neon gap-1">
                        <Check className="h-3.5 w-3.5" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => declineRequest(p.friendshipId)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Friends List */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm tracking-wider">
                YOUR FRIENDS ({friends.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {friends.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No friends yet. Search for players by username to add them!
                </p>
              ) : (
                <div className="space-y-3">
                  {friends.map(f => {
                    const lvl = getLevelInfo(f.total_points);
                    return (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-lg">
                            {lvl.badge}
                          </div>
                          <div>
                            <p className="font-heading font-semibold">{f.username}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                              <Trophy className="h-3 w-3 text-neon-orange" /> {f.total_points.toLocaleString()} pts
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5">{f.level}</Badge>
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {outgoingPending.length > 0 && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              {outgoingPending.length} pending request(s) sent
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Friends;
