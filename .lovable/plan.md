

## Plan: Database Setup, Auth, Route Protection, and Landing Page Redesign

### Problem Summary
1. Build errors in `chart.tsx` due to recharts v3 type incompatibilities (component was written for v2)
2. Profile, Dashboard, and Leaderboard pages show fake/mock data and are accessible without login
3. Landing page needs a complete redesign
4. Database has no tables yet -- need full schema setup

### Phase 1: Fix Build Errors
- Downgrade `recharts` to `^2.15.0` (chart.tsx component is built for v2 API)
- This resolves all 5 type errors in `chart.tsx`

### Phase 2: Database Schema (Supabase Migration)
Create all tables with RLS enabled:

```text
profiles         -> id (UUID, FK auth.users), username, avatar_url, bio, level, total_points, created_at
games            -> id (serial), name, slug, category, difficulty, description, icon
scores           -> id (serial), user_id (FK auth.users), game_slug, score, completion_time, accuracy, created_at
achievements     -> id (serial), name, description, icon, criteria_type, criteria_value
user_achievements-> id (serial), user_id (FK auth.users), achievement_id (FK achievements), unlocked_at
user_roles       -> id (UUID), user_id (FK auth.users), role (app_role enum: admin/moderator/user)
friendships      -> id (serial), user_id, friend_id, status (pending/accepted/declined), created_at
notifications    -> id (serial), recipient_id, type, title, message, read, created_at
```

RLS policies:
- profiles: public read, own-row update, auto-create via trigger on signup
- scores: authenticated insert (own), public read for leaderboards
- user_achievements: public read, system insert
- user_roles: security definer function `has_role()` to prevent recursion
- friendships/notifications: own-data only

Database trigger: auto-create profile row on `auth.users` insert.

Seed the `achievements` table with initial badges (First Win, Speed Demon, 7-Day Streak, etc.) and seed the `games` table with the 5 mini-games.

### Phase 3: Authentication System
- Create `src/hooks/useAuth.tsx` -- context provider wrapping `supabase.auth.onAuthStateChange` and `getSession`
- Wire up `Auth.tsx` page with real `signUp`, `signInWithPassword`, `resetPasswordForEmail`
- Create `/reset-password` page for password recovery flow
- Wrap App with `AuthProvider`

### Phase 4: Route Protection & Conditional Nav
- Create `ProtectedRoute` component that redirects to `/auth` if not logged in
- Wrap `/dashboard`, `/profile`, game play routes with `ProtectedRoute`
- Update `Navbar`:
  - Logged out: show only Games, Leaderboard, Sign In
  - Logged in: show Games, Leaderboard, Dashboard, Profile, Sign Out
- Remove ALL mock/fake data from Dashboard and Profile -- show empty states or real Supabase data

### Phase 5: Landing Page Redesign
Complete redesign with a more immersive dark gaming aesthetic:
- **Hero section**: Large animated headline with particle/glow effects, prominent CTA buttons (Sign Up / Browse Games)
- **Stats counter section**: Animated counters for total players, games played, active competitions
- **Game showcase**: Interactive carousel/grid of the 5 mini-games with hover effects and play buttons
- **How it works**: 3-step visual flow (Sign Up -> Play Games -> Climb Ranks)
- **Leaderboard preview**: Show top 5 players from real data
- **Testimonials/social proof section**: Player highlights
- **Final CTA**: Bold call to action to join
- **Footer**: Links, branding, social icons

### Technical Details

**Files to create:**
- `src/hooks/useAuth.tsx` (auth context)
- `src/components/ProtectedRoute.tsx`
- `src/pages/ResetPassword.tsx`

**Files to modify:**
- `package.json` (downgrade recharts)
- `src/App.tsx` (add AuthProvider, ProtectedRoute, new route)
- `src/components/layout/Navbar.tsx` (conditional nav based on auth)
- `src/pages/Auth.tsx` (wire to real Supabase auth)
- `src/pages/Dashboard.tsx` (remove mock data, fetch from Supabase)
- `src/pages/Profile.tsx` (remove mock data, fetch from Supabase)
- `src/pages/Leaderboard.tsx` (fetch real data from Supabase)
- `src/pages/Index.tsx` (complete redesign)
- `src/integrations/supabase/types.ts` (will auto-update after migration)

**Migration SQL:** One migration creating all tables, RLS policies, trigger function, seed data, and `has_role` security definer function.

