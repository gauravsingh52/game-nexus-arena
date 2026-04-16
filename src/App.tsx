import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import Navbar from "@/components/layout/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Games from "./pages/Games";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import NotFound from "./pages/NotFound";
import MemoryMatch from "./components/games/MemoryMatch";
import SpeedTyper from "./components/games/SpeedTyper";
import QuizChallenge from "./components/games/QuizChallenge";
import ReactionTime from "./components/games/ReactionTime";
import MathBlitz from "./components/games/MathBlitz";
import SnakeGame from "./components/games/SnakeGame";
import WhackAMole from "./components/games/WhackAMole";
import ColorMatch from "./components/games/ColorMatch";
import WordScramble from "./components/games/WordScramble";
import AimTrainer from "./components/games/AimTrainer";
import SimonSays from "./components/games/SimonSays";
import Game2048 from "./components/games/Game2048";
import TicTacToe from "./components/games/TicTacToe";
import Hangman from "./components/games/Hangman";
import NumberGuess from "./components/games/NumberGuess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/games" element={<Games />} />
              {/* Games are playable without login; scores save only if signed in */}
              <Route path="/games/memory-match" element={<MemoryMatch />} />
              <Route path="/games/speed-typer" element={<SpeedTyper />} />
              <Route path="/games/quiz-challenge" element={<QuizChallenge />} />
              <Route path="/games/reaction-time" element={<ReactionTime />} />
              <Route path="/games/math-blitz" element={<MathBlitz />} />
              <Route path="/games/snake-game" element={<SnakeGame />} />
              <Route path="/games/whack-a-mole" element={<WhackAMole />} />
              <Route path="/games/color-match" element={<ColorMatch />} />
              <Route path="/games/word-scramble" element={<WordScramble />} />
              <Route path="/games/aim-trainer" element={<AimTrainer />} />
              <Route path="/games/simon-says" element={<SimonSays />} />
              <Route path="/games/2048" element={<Game2048 />} />
              <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
              <Route path="/games/hangman" element={<Hangman />} />
              <Route path="/games/number-guess" element={<NumberGuess />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
