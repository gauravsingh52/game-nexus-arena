import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
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
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/memory-match" element={<ProtectedRoute><MemoryMatch /></ProtectedRoute>} />
            <Route path="/games/speed-typer" element={<ProtectedRoute><SpeedTyper /></ProtectedRoute>} />
            <Route path="/games/quiz-challenge" element={<ProtectedRoute><QuizChallenge /></ProtectedRoute>} />
            <Route path="/games/reaction-time" element={<ProtectedRoute><ReactionTime /></ProtectedRoute>} />
            <Route path="/games/math-blitz" element={<ProtectedRoute><MathBlitz /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
