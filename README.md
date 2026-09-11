# 🎮 Game Nexus Arena

> A modern gaming hub featuring interactive mini-games, player progression, leaderboards, achievements, and personalized gaming dashboards.

Game Nexus Arena is a full-featured browser-based gaming platform built with React and TypeScript. It brings together a collection of interactive mini-games with user accounts, score tracking, player levels, achievements, streaks, leaderboards, and social features.

The platform is designed to provide a simple but engaging gaming experience while demonstrating modern frontend architecture, authentication, database integration, responsive UI, animations, and data-driven dashboards.

---

## 🌐 Live Demo

🚀 **Play Game Nexus Arena:**  
https://game-nexus-arena.vercel.app/

📂 **GitHub Repository:**  
https://github.com/gauravsingh52/game-nexus-arena

---

## ✨ Features

### 🎮 15+ Interactive Games

Game Nexus Arena currently includes:

- 🧠 Memory Match
- ⌨️ Speed Typer
- 🧩 Quiz Challenge
- ⚡ Reaction Time
- ➕ Math Blitz
- 🐍 Snake
- 🔨 Whack-a-Mole
- 🎨 Color Match
- 🔤 Word Scramble
- 🎯 Aim Trainer
- 🟢 Simon Says
- 🔢 2048
- ❌ Tic Tac Toe
- 👻 Hangman
- 🔮 Number Guess

Games can be played directly from the game library, with scores being saved for authenticated users.

---

## 🔎 Game Discovery

The game library provides multiple ways to discover games.

### Search

Search games by name using the built-in search functionality.

### Categories

Games can be filtered by:

- All
- Puzzle
- Arcade
- Strategy
- Action

### Difficulty

Players can filter games by:

- Easy
- Medium
- Hard

### Sorting

Games can be sorted by:

- Most Popular
- Top Rated
- A-Z

---

## 👤 Authentication

Game Nexus Arena uses **Supabase Authentication** for user accounts and sessions.

Authenticated users can access personalized features such as:

- Player dashboard
- Profile
- Friends
- Saved scores
- Achievements
- Progression
- Personalized statistics

Games remain playable without authentication, while score persistence is available to signed-in players.

---

## 📊 Player Dashboard

The dashboard provides a personalized overview of player activity.

### Dashboard statistics

- 🏆 Total Points
- 🎮 Games Played
- 🎯 Unique Games
- ⚡ Best Score

### Additional features

- 🔥 Current playing streak
- ⭐ Daily challenge
- 🎮 Quick Play
- 📈 Recent score analytics
- 🕹️ Recently played games
- 🏅 Achievement progress
- 📊 Player level progression

The dashboard retrieves player profiles, scores and achievements from Supabase and visualizes recent performance using charts.

---

## 🏆 Leaderboard

Game Nexus Arena includes a competitive leaderboard system.

Players can explore:

- 🌎 Global rankings
- 📅 Weekly rankings
- 🎮 Game-specific rankings

Leaderboard entries display:

- Player rank
- Username
- Points
- Player level

The platform supports rankings across individual games as well as overall player performance.

---

## 🏅 Achievements & Progression

Players can progress through the platform by earning points and unlocking achievements.

The progression system includes:

- Player levels
- Experience/points
- Achievement badges
- Progress tracking
- Score history
- Playing streaks

This creates a gamified experience that encourages continued participation.

---

## 👥 Social Features

The platform also includes a dedicated friends system.

Players can:

- View their profile
- Access their friends section
- Build a personalized gaming identity
- Participate in the broader competitive experience

---

## 🎨 Modern UI / UX

Game Nexus Arena uses a gaming-inspired visual system with:

- Dark interface
- Neon visual accents
- Animated interactions
- Responsive layouts
- Interactive cards
- Smooth page transitions
- Modern typography
- Reusable UI components

Animations are implemented using **Framer Motion**.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | Frontend framework |
| TypeScript | Type-safe development |
| Vite | Development & build tooling |
| Tailwind CSS | Styling & responsive design |
| shadcn/ui | Reusable UI components |
| Radix UI | Accessible UI primitives |
| Supabase | Authentication & database |
| React Router | Client-side routing |
| TanStack Query | Data/state management |
| Framer Motion | Animations & transitions |
| Recharts | Dashboard charts |
| React Hook Form | Form management |
| Zod | Schema validation |
| Vitest | Unit testing |
| Playwright | Browser testing |
| ESLint | Code quality |

The current repository's `package.json` confirms the React/TypeScript/Vite stack along with Supabase, Tailwind CSS, React Router, Framer Motion, Recharts, Vitest and Playwright dependencies. 

---

## 🏗️ Application Architecture

```text
                         🎮 GAME NEXUS ARENA
                                  │
                                  ▼
                         React + TypeScript
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
        Game Library          User System          Dashboard
             │                    │                    │
       ┌─────┴─────┐        ┌─────┴─────┐       ┌─────┴─────┐
       │           │        │           │       │           │
     Search      Filters   Auth       Profile  Scores   Analytics
       │           │        │           │       │           │
       └─────┬─────┘        └─────┬─────┘       └─────┬─────┘
             │                    │                    │
             └────────────────────┼────────────────────┘
                                  ▼
                              Supabase
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                 Profiles       Scores      Achievements
                    │             │             │
                    └─────────────┼─────────────┘
                                  ▼
                            Leaderboards
