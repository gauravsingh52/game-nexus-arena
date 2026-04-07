

## Plan: Wire Up Score Saving, Fix Bugs, and Complete the System

### Bugs Identified

1. **Missing database trigger**: The `handle_new_user()` function exists but no trigger is attached to `auth.users`, so profiles are NOT auto-created on signup. The existing profile was likely inserted manually.
2. **No score saving**: None of the 10 games save scores to Supabase. They all calculate scores locally but never persist them.
3. **No total_points update**: Even if scores were saved, nothing updates `profiles.total_points`.
4. **Dashboard join query bug**: The query `user_achievements.select("achievement_id, achievements(name, icon)")` uses a foreign key join on `achievements`, which exists in the schema -- this should work, but needs the relationship to be correct.
5. **Leaderboard ignores tab selection**: The `tab` state changes but `fetchLeaderboard` always runs the same query regardless of "global", "weekly", or "game" tab.
6. **Achievement criteria outdated**: Achievements reference only 5 games (`unique_games: 5`) but there are now 10 games.

### Phase 1: Database Migration

Create a migration that:
- Attaches the trigger `on_auth_user_created` to `auth.users` AFTER INSERT, calling `handle_new_user()`
- Creates a function `update_user_points()` that recalculates `profiles.total_points` as the sum of all scores for that user, triggered AFTER INSERT on `scores`
- Updates the "Game Master" achievement from `criteria_value: 5` to `criteria_value: 10`

### Phase 2: Create a Shared Score-Saving Hook

Create `src/hooks/useScoreSaver.ts`:
- Accepts `gameSlug`, `score`, `completionTime?`, `accuracy?`
- Inserts into `scores` table with `user_id` from auth
- Shows a toast on success/failure
- Returns `{ saveScore, saving }` state

### Phase 3: Wire Score Saving into All 10 Games

Modify each game component to:
- Import `useAuth` and `useScoreSaver`
- Call `saveScore()` when the game ends (on game-over state)
- Use `useEffect` triggered by `gameOver` state to save once
- Show a "Score saved!" indicator

Games to update:
- `MemoryMatch` -- save on `gameOver` with `completion_time: time`
- `SpeedTyper` -- save on `gameOver` with `accuracy: wordsTyped/GAME_TIME`
- `QuizChallenge` -- save on `gameOver` with `accuracy: correctCount/questions.length`
- `ReactionTime` -- save on phase `"done"` with `completion_time: avg`
- `MathBlitz` -- save on `gameOver` with `accuracy: solved`
- `SnakeGame` -- save on game over
- `WhackAMole` -- save on game over with `accuracy`
- `ColorMatch` -- save on game over with `accuracy`
- `WordScramble` -- save on game over
- `AimTrainer` -- save on `gameOver` with `accuracy` and `completion_time: avgTime`

### Phase 4: Fix Leaderboard

Update `Leaderboard.tsx`:
- **Global tab**: Query `profiles` ordered by `total_points` (current behavior)
- **Weekly tab**: Query `scores` from last 7 days, group by `user_id`, sum scores, join with profiles
- **Game tab**: Add a game selector dropdown, query `scores` filtered by `game_slug`, show top scores

### Phase 5: Fix Dashboard Query

- Change the `user_achievements` join to handle the case where no achievements exist gracefully
- Ensure the chart and recent games sections handle empty data without errors

### Files to Create
- `src/hooks/useScoreSaver.ts`

### Files to Modify
- All 10 game components (add score saving)
- `src/pages/Leaderboard.tsx` (fix tabs)
- `src/pages/Dashboard.tsx` (minor query fixes)

### Migration SQL
- Attach `handle_new_user` trigger to `auth.users`
- Create `update_user_points` trigger function + trigger on `scores`
- Update achievement criteria value

