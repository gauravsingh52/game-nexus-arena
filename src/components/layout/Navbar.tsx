import { useState } from "react";
import { Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Gamepad2, Trophy, LayoutDashboard, User, Menu, X, Bell, LogOut, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

const THEME_LABELS: Record<string, string> = {
  "neon-dark": "🔵 Neon",
  "cyber-purple": "🟣 Cyber",
  "ocean-blue": "🌊 Ocean",
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, cycleTheme } = useTheme();

  const navLinks = [
    { to: "/games", label: "Games", icon: Gamepad2, requiresAuth: false },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy, requiresAuth: false },
    { to: "/friends", label: "Friends", icon: Users, requiresAuth: true },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, requiresAuth: true },
    { to: "/profile", label: "Profile", icon: User, requiresAuth: true },
  ].filter((link) => !link.requiresAuth || user);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-neon flex items-center justify-center glow-blue">
            <Gamepad2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-wider text-foreground">
            NEXUS<span className="text-primary">ARENA</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}>
                <Button
                  variant="ghost"
                  className={`gap-2 font-heading text-sm tracking-wide ${
                    active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={cycleTheme}
            className="text-muted-foreground hover:text-foreground font-heading gap-1 text-xs"
          >
            <Palette className="h-4 w-4" />
            {THEME_LABELS[theme]}
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Bell className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-muted-foreground hover:text-foreground font-heading gap-1"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button className="gradient-neon glow-blue font-heading tracking-wide text-sm">Sign In</Button>
            </Link>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2 font-heading">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
              <Button onClick={cycleTheme} variant="ghost" className="w-full justify-start gap-2 font-heading">
                <Palette className="h-4 w-4" />
                Theme: {THEME_LABELS[theme]}
              </Button>
              {user ? (
                <Button onClick={() => { signOut(); setMobileOpen(false); }} variant="outline" className="w-full font-heading mt-2 gap-1">
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full gradient-neon glow-blue font-heading mt-2">Sign In</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
