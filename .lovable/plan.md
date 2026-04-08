

## Plan: Fix Leaderboard, Add Profile Editing, Polish Landing Page, More Games, Theme System

### 1. Fix Leaderboard (Root Cause)

The leaderboard code in `Leaderboard.tsx` looks structurally correct but has these issues:
- Uses `.single()` in some profile queries which throws errors if no profile exists (use `.maybeSingle()`)
- The `useScoreSaver` and `useAuth` also use `.single()` which can fail silently
- The leaderboard "By Game" filter uses slug `"snake"` which matches saved data, but the game selector needs to stay in sync

**Fix**: Replace all `.single()` calls with `.maybeSingle()` across `useAuth.tsx`, `useScoreSaver.ts`, `Dashboard.tsx`, and `Profile.tsx`. Ensure leaderboard queries handle empty results gracefully.

### 2. Add Profile Editing

Add inline editing to `Profile.tsx`:
- Edit button toggles edit mode with input fields for username and bio
- Save button calls `supabase.from("profiles").update({...}).eq("id", user.id)`
- Cancel button reverts changes
- Toast feedback on save success/failure

### 3. Fix Landing Page Polish

The landing page is already well-built. Minor fixes:
- Ensure the "BROWSE GAMES" button works without auth (it links to `/games` which is public -- OK)
- Fix any broken CSS animations (verify `animate-marquee` works)
- Clean up the footer links for logged-in users

### 4. Add 5 More Games (Total: 15)

Create 5 new games:
- **Simon Says** (`SimonSays.tsx`) -- Memory sequence game with colors/sounds, increasing pattern length
- **2048** (`Game2048.tsx`) -- Slide tiles on a 4x4 grid to combine matching numbers
- **Tic Tac Toe** (`TicTacToe.tsx`) -- Play against AI with minimax algorithm
- **Hangman** (`Hangman.tsx`) -- Guess the word letter by letter before running out of attempts
- **Number Guess** (`NumberGuess.tsx`) -- Binary search style guessing game with hot/cold hints

Each game: standalone component, score saving via `useScoreSaver`, game-over screen with restart.

### 5. Theme System

Add a theme switcher supporting 3 themes:
- **Neon Dark** (current default)
- **Cyber Purple** -- Purple-dominant palette
- **Ocean Blue** -- Blue/teal palette

Implementation:
- Create `src/hooks/useTheme.tsx` context provider with `localStorage` persistence
- Define CSS variable overrides for each theme in `index.css`
- Add theme toggle button to Navbar (icon cycles through themes)
- Apply theme class to `<html>` element

### Dashboard Enhancement

Make the dashboard more visually appealing:
- Add animated gradient header with user avatar area
- Redesign stat cards with animated borders and hover effects
- Add a "Quick Play" section with game shortcuts
- Improve the chart styling with gradient fills
- Add a streak/activity heatmap-style indicator

### Files to Create
- `src/components/games/SimonSays.tsx`
- `src/components/games/Game2048.tsx`
- `src/components/games/TicTacToe.tsx`
- `src/components/games/Hangman.tsx`
- `src/components/games/NumberGuess.tsx`
- `src/hooks/useTheme.tsx`

### Files to Modify
- `src/hooks/useAuth.tsx` -- `.single()` to `.maybeSingle()`
- `src/hooks/useScoreSaver.ts` -- `.single()` to `.maybeSingle()`
- `src/pages/Profile.tsx` -- Add edit mode, `.single()` to `.maybeSingle()`
- `src/pages/Dashboard.tsx` -- Visual redesign, `.single()` to `.maybeSingle()`, quick play section
- `src/pages/Leaderboard.tsx` -- Fix edge cases in data fetching
- `src/pages/Index.tsx` -- Minor polish
- `src/data/games.ts` -- Add 5 new game entries
- `src/App.tsx` -- Add 5 new routes, wrap with ThemeProvider
- `src/components/layout/Navbar.tsx` -- Add theme toggle button
- `src/index.css` -- Add theme CSS variable sets
- `tailwind.config.ts` -- No changes needed (themes use CSS vars)

### Technical Notes
- No new npm dependencies needed
- All themes use CSS custom properties, so switching is instant with zero re-renders
- Profile editing uses optimistic UI update with rollback on error
- New games follow the same pattern as existing games (useScoreSaver hook, game-over state, reset)

