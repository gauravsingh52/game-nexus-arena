
-- Function to recalculate total_points after a score is inserted
CREATE OR REPLACE FUNCTION public.update_user_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET total_points = (
    SELECT COALESCE(SUM(score), 0)
    FROM public.scores
    WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Trigger on scores table
CREATE TRIGGER on_score_inserted
AFTER INSERT ON public.scores
FOR EACH ROW
EXECUTE FUNCTION public.update_user_points();

-- Update Game Master achievement to 10 games
UPDATE public.achievements
SET criteria_value = 10
WHERE criteria_type = 'unique_games' AND criteria_value = 5;
