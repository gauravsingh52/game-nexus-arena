import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Supabase not connected",
      description: "Please connect your Supabase project to enable authentication.",
    });
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(270_80%_60%/0.08),transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="text-center mb-8">
            <div className="h-12 w-12 mx-auto rounded-xl gradient-neon flex items-center justify-center glow-blue mb-4">
              <Gamepad2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-wider">
              {mode === "login" ? "WELCOME BACK" : mode === "signup" ? "JOIN THE ARENA" : "RESET PASSWORD"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login"
                ? "Sign in to continue your journey"
                : mode === "signup"
                ? "Create your gaming profile"
                : "We'll send you a reset link"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label className="font-heading">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="GamerTag" className="pl-10 bg-muted border-border" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label className="font-heading">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder="player@nexusarena.com" className="pl-10 bg-muted border-border" />
              </div>
            </div>
            {mode !== "reset" && (
              <div className="space-y-2">
                <Label className="font-heading">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" className="pl-10 bg-muted border-border" />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full gradient-neon glow-blue font-display tracking-wider">
              {mode === "login" ? "SIGN IN" : mode === "signup" ? "CREATE ACCOUNT" : "SEND RESET LINK"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
            {mode === "login" && (
              <>
                <button onClick={() => setMode("reset")} className="text-primary hover:underline block mx-auto">
                  Forgot password?
                </button>
                <p>
                  Don't have an account?{" "}
                  <button onClick={() => setMode("signup")} className="text-primary hover:underline">
                    Sign up
                  </button>
                </p>
              </>
            )}
            {mode === "signup" && (
              <p>
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-primary hover:underline">
                  Sign in
                </button>
              </p>
            )}
            {mode === "reset" && (
              <button onClick={() => setMode("login")} className="text-primary hover:underline flex items-center gap-1 mx-auto">
                <ArrowLeft className="h-3 w-3" /> Back to login
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
