

## Plan: Dynamic Landing Page Redesign + 5 New Games (10 Total)

### Current State
- 5 working games: Memory Match, Speed Typer, Quiz Challenge, Reaction Time, Math Blitz
- Landing page is functional but static with basic card layouts
- Dark gaming theme with neon accents already in place

### Part 1: Landing Page Overhaul

Completely redesign `src/pages/Index.tsx` with heavy animation and gaming graphics:

- **Animated particle/floating elements background** -- CSS-based floating neon orbs, grid lines, and scanline effects throughout the page
- **Hero section** -- Massive glitching text effect on "NEXUS ARENA" using CSS keyframes, animated controller/gamepad SVG graphic, pulsing neon border, typing animation on tagline
- **Animated stats counter** -- Numbers that count up on scroll using `useIntersectionObserver` + `useState` animation (e.g., "10+ Games", "Live Rankings", "24/7")
- **Game carousel/showcase** -- Horizontal scrollable game cards with 3D tilt hover effect (CSS perspective transform), glowing card borders that pulse, animated icons
- **How it works** -- Animated timeline with connecting neon lines, step icons that animate in sequence
- **Features grid** -- Cards with animated icon backgrounds (rotating/pulsing), glassmorphism effect
- **Testimonials/social proof** -- Animated avatar stack, marquee-style scrolling player names
- **Final CTA** -- Large pulsing button with ring animation, background energy wave effect
- **Footer** -- Neon divider line animation

New CSS utilities in `src/index.css`:
- `@keyframes glitch` -- text glitch effect
- `@keyframes scanline` -- CRT scanline overlay
- `@keyframes float-random` -- varied floating for particles
- `@keyframes count-up` -- number counter
- `@keyframes neon-pulse` -- border glow pulsing

### Part 2: 5 New Games

Add 5 new fully functional games to reach 10 total:

**6. Snake Game** (`src/components/games/SnakeGame.tsx`)
- Classic snake on a grid using canvas or div-based rendering
- Arrow key controls, growing snake, random food spawning
- Score based on length, increasing speed per level
- Category: arcade, Difficulty: medium

**7. Whack-a-Mole** (`src/components/games/WhackAMole.tsx`)
- 3x3 grid of holes, moles pop up randomly with decreasing intervals
- Click/tap to whack, combo streaks for bonus points
- 30-second rounds, score tracking
- Category: action, Difficulty: easy

**8. Color Match** (`src/components/games/ColorMatch.tsx`)
- Word shows a color name but rendered in a different color
- Player must click whether the TEXT matches the COLOR (Stroop test)
- Timed rounds, accuracy tracking
- Category: puzzle, Difficulty: hard

**9. Word Scramble** (`src/components/games/WordScramble.tsx`)
- Scrambled letters, player rearranges to form the correct word
- Hint system, timed scoring, difficulty progression
- Category: puzzle, Difficulty: medium

**10. Aim Trainer** (`src/components/games/AimTrainer.tsx`)
- Targets appear at random positions in a play area
- Click targets as fast as possible, targets shrink over time
- Tracks accuracy (hits vs misses), average time per target
- Category: action, Difficulty: hard

### Files to Create
- `src/components/games/SnakeGame.tsx`
- `src/components/games/WhackAMole.tsx`
- `src/components/games/ColorMatch.tsx`
- `src/components/games/WordScramble.tsx`
- `src/components/games/AimTrainer.tsx`

### Files to Modify
- `src/pages/Index.tsx` -- Complete redesign with animations
- `src/index.css` -- New keyframe animations and utility classes
- `src/data/games.ts` -- Add 5 new game entries
- `src/App.tsx` -- Add 5 new routes
- `tailwind.config.ts` -- Add new animation keyframes (glitch, scanline, neon-pulse)

### Technical Notes
- All animations use CSS keyframes + framer-motion (already installed)
- No new dependencies needed
- Each game follows the same pattern as existing games: standalone component with state management, score tracking, reset, and game-over screen
- Snake game uses `useEffect` + `setInterval` for game loop with keyboard event listeners
- All games use the existing dark theme and neon color palette

