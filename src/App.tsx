import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/Navbar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Games from "./pages/Games";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import MemoryMatch from "./components/games/MemoryMatch";
import SpeedTyper from "./components/games/SpeedTyper";
import QuizChallenge from "./components/games/QuizChallenge";
import ReactionTime from "./components/games/ReactionTime";
import MathBlitz from "./components/games/MathBlitz";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/memory-match" element={<MemoryMatch />} />
          <Route path="/games/speed-typer" element={<SpeedTyper />} />
          <Route path="/games/quiz-challenge" element={<QuizChallenge />} />
          <Route path="/games/reaction-time" element={<ReactionTime />} />
          <Route path="/games/math-blitz" element={<MathBlitz />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
