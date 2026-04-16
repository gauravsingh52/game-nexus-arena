import { useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface SaveScoreParams {
  gameSlug: string;
  score: number;
  completionTime?: number;
  accuracy?: number;
}

export const useScoreSaver = () => {
  const { user } = useAuth();
  const savedRef = useRef(false);

  const saveScore = useCallback(async ({ gameSlug, score, completionTime, accuracy }: SaveScoreParams) => {
    if (savedRef.current || score <= 0) return;

    if (!user) {
      toast.info("Sign in to save your score!", { duration: 4000 });
      return;
    }

    savedRef.current = true;

    // Ensure profile exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      await supabase.from("profiles").insert({
        id: user.id,
        username: user.user_metadata?.username || "Player_" + user.id.slice(0, 8),
      });
    }

    const { error } = await supabase.from("scores").insert({
      user_id: user.id,
      game_slug: gameSlug,
      score,
      completion_time: completionTime ?? null,
      accuracy: accuracy ?? null,
    });

    if (error) {
      toast.error("Failed to save score");
      savedRef.current = false;
    } else {
      toast.success(`Score saved: ${score} pts!`);
    }
  }, [user]);

  const resetSaver = useCallback(() => {
    savedRef.current = false;
  }, []);

  return { saveScore, resetSaver };
};
