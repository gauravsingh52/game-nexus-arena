import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface Friend {
  id: string;
  username: string;
  total_points: number;
  level: string;
  avatar_url: string | null;
  friendshipId: number;
  status: string;
  isIncoming: boolean;
}

export const useFriends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pending, setPending] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: friendships } = await supabase
      .from("friendships")
      .select("id, user_id, friend_id, status")
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    if (!friendships || friendships.length === 0) {
      setFriends([]);
      setPending([]);
      setLoading(false);
      return;
    }

    const otherIds = friendships.map(f => f.user_id === user.id ? f.friend_id : f.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, total_points, level, avatar_url")
      .in("id", otherIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p]) ?? []);

    const all = friendships.map(f => {
      const otherId = f.user_id === user.id ? f.friend_id : f.user_id;
      const p = profileMap.get(otherId);
      return {
        id: otherId,
        username: p?.username ?? "Unknown",
        total_points: p?.total_points ?? 0,
        level: p?.level ?? "Beginner",
        avatar_url: p?.avatar_url ?? null,
        friendshipId: f.id,
        status: f.status,
        isIncoming: f.friend_id === user.id,
      };
    });

    setFriends(all.filter(f => f.status === "accepted"));
    setPending(all.filter(f => f.status === "pending"));
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchFriends(); }, [fetchFriends]);

  const sendRequest = async (username: string) => {
    if (!user) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username.trim())
      .maybeSingle();

    if (!profile) { toast.error("User not found"); return; }
    if (profile.id === user.id) { toast.error("Can't add yourself"); return; }

    const { error } = await supabase.from("friendships").insert({
      user_id: user.id,
      friend_id: profile.id,
      status: "pending",
    });

    if (error) {
      toast.error(error.message.includes("duplicate") ? "Request already sent" : "Failed to send request");
    } else {
      toast.success("Friend request sent!");
      // Send notification
      await supabase.from("notifications").insert({
        recipient_id: profile.id,
        title: "Friend Request",
        message: `${user.user_metadata?.username ?? "Someone"} wants to be your friend!`,
        type: "friend_request",
      });
      fetchFriends();
    }
  };

  const acceptRequest = async (friendshipId: number) => {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", friendshipId);
    if (error) toast.error("Failed to accept");
    else { toast.success("Friend added!"); fetchFriends(); }
  };

  const declineRequest = async (friendshipId: number) => {
    // We can't delete with current RLS, so we update status to "declined"
    const { error } = await supabase
      .from("friendships")
      .update({ status: "declined" })
      .eq("id", friendshipId);
    if (error) toast.error("Failed to decline");
    else { toast.success("Request declined"); fetchFriends(); }
  };

  return { friends, pending, loading, sendRequest, acceptRequest, declineRequest, refetch: fetchFriends };
};
