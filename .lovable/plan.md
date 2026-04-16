

## Plan: Fix Leaderboard, Add Features, Clean Up Architecture

### 1. Fix Leaderboard (Root Cause Found)

**Bug**: When fewer than 3 players exist, the leaderboard renders nothing. Lines 182-206 only show the podium if `entries.length >= 3`, and line 209 renders `entries.slice(3)` which is empty when there are 1-2 players. The data IS in the database (lalsalam with 3000 pts) but never displays.

**Fix**: Rewrite the rendering logic to handle any number of players -- show a simple ranked list when fewer than 3 exist, and the podium + list when 3+ exist.

Also: the `scores` table has `game_slug: "snake"` but `games.ts` uses `"snake-game"` -- fix the slug mismatch in the SnakeGame save call or handle both.

### 2. Remove Fake Stats from Landing Page

The hero section (Index.tsx lines 70-75) shows hardcoded fake numbers: "5000+ PLAYERS", "50000+ GAMES PLAYED". Replace with real counts fetched from Supabase on mount:
- Count of profiles for players
- Count of scores for games played  
- Count of games (15)
- Keep "24/7" as a static feature label

### 3. Allow Playing Without Login

Remove `ProtectedRoute` wrapper from all 15 game routes in `App.tsx`. Instead, modify `useScoreSaver` to silently skip saving when no user is logged in, and show a "Sign in to save your score" prompt on game-over when not authenticated.

### 4. Dashboard Gamification

Add to `Dashboard.tsx`:
- **XP progress bar** toward next level (calculate from total_points thresholds)
- **Daily challenge** section with a random game suggestion
- **Win streak** counter (consecutive days with scores)
- **Rank badge** with animated glow based on level
- Level-up thresholds: Beginner (0), Intermediate (1000), Advanced (5000), Expert (15000), Legend (50000)

### 5. Enhanced Profile Page (10 Features)

Redesign `Profile.tsx` with:
1. **Avatar upload** (Supabase storage bucket)
2. **Game history timeline** (recent scores with game icons)
3. **Favorite game** (most played game auto-detected)
4. **Win rate / accuracy stats** per game
5. **Level progress bar** with XP to next level
6. **Profile share link** (copy to clipboard)
7. **Joined date** with "member for X months" display
8. **Top 3 best scores** showcase
9. **Activity heatmap** (games played per day, last 30 days)
10. **Animated rank badge** with tier-specific styling

### 6. Friends System

**Database migration** -- create tables and policies:
- Use existing `friendships` table (already has `user_id`, `friend_id`, `status`)
- Add a `challenges` table: `id, challenger_id, challenged_id, game_slug, status (pending/accepted/completed), challenger_score, challenged_score, created_at`
- RLS: users can view/create/update their own challenges

**New components:**
- `src/pages/Friends.tsx` -- Friends list, pending requests, search users
- `src/components/FriendCard.tsx` -- Friend display with challenge button
- Add route `/friends` (protected)

**Features**: Send friend request by username search, accept/decline, view friend scores, challenge friend to a specific game.

### 7. File Architecture Restructure

Reorganize `src/` with clear grouping:

```text
src/
  components/
    games/           (all 15 game components)
    layout/          (Navbar, Footer)
    friends/         (FriendCard, FriendRequest, ChallengeCard)
    profile/         (ProfileHeader, GameHistory, ActivityHeatmap, StatsGrid)
    dashboard/       (StatCard, QuickPlay, LevelProgress, DailyChallenge)
    ui/              (shadcn components)
  hooks/
    useAuth.tsx
    useTheme.tsx
    useScoreSaver.ts
    useFriends.ts    (new)
    useProfile.ts    (new - extract profile logic)
  pages/
    Index.tsx, Auth.tsx, Games.tsx, Dashboard.tsx,
    Leaderboard.tsx, Profile.tsx, Friends.tsx
  data/
    games.ts
  lib/
    utils.ts
    levels.ts        (new - level thresholds & calculations)
  integrations/
    supabase/
```

Add `src/lib/levels.ts` with shared level calculation logic used by Dashboard, Profile, and Leaderboard.

### 8. Database Migration Required

Create migration for:
- `challenges` table with RLS policies
- Create a Supabase storage bucket `avatars` for profile pictures
- Add trigger for `handle_new_user` on `auth.users` (currently missing per DB trigger list)

### Files to Create
- `src/pages/Friends.tsx`
- `src/components/friends/FriendCard.tsx`
- `src/components/friends/ChallengeCard.tsx`
- `src/components/profile/ActivityHeatmap.tsx`
- `src/components/profile/GameHistory.tsx`
- `src/components/dashboard/LevelProgress.tsx`
- `src/components/dashboard/DailyChallenge.tsx`
- `src/lib/levels.ts`
- `src/hooks/useFriends.ts`

### Files to Modify
- `src/pages/Leaderboard.tsx` -- Fix rendering for < 3 players
- `src/pages/Index.tsx` -- Replace fake stats with real DB counts
- `src/pages/Dashboard.tsx` -- Add gamification widgets
- `src/pages/Profile.tsx` -- Full redesign with 10 features
- `src/App.tsx` -- Remove ProtectedRoute from games, add /friends route
- `src/hooks/useScoreSaver.ts` -- Handle unauthenticated gracefully
- `src/components/layout/Navbar.tsx` -- Add Friends link
- `src/components/games/SnakeGame.tsx` -- Fix slug to "snake-game"

### Execution Order
1. Database migration (challenges table, avatars bucket, handle_new_user trigger)
2. Fix leaderboard rendering bug
3. Remove ProtectedRoute from games + update useScoreSaver
4. Remove fake stats from landing page
5. Create levels.ts utility
6. Enhance Dashboard with gamification
7. Redesign Profile with 10 features
8. Build Friends system
9. Restructure file architecture

