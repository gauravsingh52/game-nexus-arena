import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gamepad2, Trophy, Zap, Users, ArrowRight, Shield, Target, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gamesData } from "@/data/games";

const Index = () => {
  return (
    <div className="min-h-screen pt-16 overflow-hidden">
      {/* Hero */}
      <section className="relative py-24 md:py-40">
        {/* Ambient glow effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(220_90%_56%/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(270_80%_60%/0.12),transparent_50%)]" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(hsl(220 90% 56%) 1px, transparent 1px), linear-gradient(90deg, hsl(220 90% 56%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8"
            >
              <div className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-xs font-heading text-muted-foreground tracking-wide">LIVE — PLAYERS COMPETING NOW</span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-wider leading-none mb-8">
              <span className="block">ENTER THE</span>
              <span className="block mt-2">
                <span className="text-primary text-glow-blue">NEXUS</span>
                <span className="text-secondary text-glow-purple ml-4">ARENA</span>
              </span>
            </h1>

            <p className="font-heading text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Battle through mind-bending puzzles, lightning-fast challenges, and fierce competition.
              Climb the ranks. Earn your legacy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="gradient-neon glow-blue font-display tracking-wider text-sm px-10 h-12">
                  CREATE ACCOUNT <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/games">
                <Button size="lg" variant="outline" className="font-display tracking-wider text-sm px-10 h-12 border-primary/30 hover:bg-primary/10 hover:border-primary/50">
                  BROWSE GAMES
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 border-y border-border bg-card/30">
        <div className="container">
          <div className="grid grid-cols-3 divide-x divide-border">
            {[
              { value: "5+", label: "Mini-Games" },
              { value: "∞", label: "Replay Value" },
              { value: "24/7", label: "Competition" },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center py-4"
              >
                <p className="font-display text-2xl md:text-3xl font-black text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground font-heading tracking-wide mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wider mb-3">
              HOW IT <span className="text-primary text-glow-blue">WORKS</span>
            </h2>
            <p className="text-muted-foreground font-heading">Three steps to gaming glory</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", icon: Shield, title: "CREATE ACCOUNT", desc: "Sign up in seconds and set up your gamer profile", color: "text-neon-blue" },
              { step: "02", icon: Swords, title: "PLAY & COMPETE", desc: "Choose from 5+ mini-games and rack up points", color: "text-neon-purple" },
              { step: "03", icon: Trophy, title: "CLIMB RANKS", desc: "Dominate leaderboards and unlock achievements", color: "text-neon-orange" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative group"
              >
                <div className="text-center p-8 rounded-2xl border border-border bg-card/50 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_hsl(220_90%_56%/0.1)]">
                  <span className="font-display text-5xl font-black text-muted/50 block mb-4">{item.step}</span>
                  <item.icon className={`h-8 w-8 mx-auto mb-4 ${item.color}`} />
                  <h3 className="font-display text-sm font-bold tracking-wider mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Showcase */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wider">
                THE <span className="text-primary text-glow-blue">GAMES</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-2 font-heading">Test your skills across multiple categories</p>
            </div>
            <Link to="/games">
              <Button variant="ghost" className="font-heading text-primary gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamesData.slice(0, 6).map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={game.route}>
                  <div className="group relative p-6 rounded-2xl border border-border bg-card/50 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_40px_hsl(220_90%_56%/0.08)] cursor-pointer">
                    <div className="text-4xl mb-4">{game.icon}</div>
                    <h3 className="font-display text-lg font-bold tracking-wider mb-1">{game.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{game.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-heading px-2 py-0.5 rounded-full border border-border bg-muted/50 capitalize">{game.category}</span>
                      <span className="text-xs font-heading px-2 py-0.5 rounded-full border border-border bg-muted/50 capitalize">{game.difficulty}</span>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wider mb-3">
              WHY <span className="text-secondary text-glow-purple">NEXUS ARENA</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Gamepad2, title: "5+ Mini-Games", desc: "Puzzle, arcade, strategy & action", color: "text-neon-blue" },
              { icon: Trophy, title: "Live Rankings", desc: "Real-time global leaderboards", color: "text-neon-purple" },
              { icon: Zap, title: "Earn Rewards", desc: "Points, badges & achievements", color: "text-neon-green" },
              { icon: Users, title: "Social Play", desc: "Add friends & compare scores", color: "text-neon-pink" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-colors"
              >
                <f.icon className={`h-8 w-8 mx-auto mb-3 ${f.color}`} />
                <h3 className="font-display text-sm font-bold tracking-wider mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 border-t border-border relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(270_80%_60%/0.08),transparent_60%)]" />
        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <div className="h-16 w-16 mx-auto rounded-2xl gradient-neon flex items-center justify-center glow-blue mb-6">
              <Target className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-wider mb-4">
              READY TO <span className="text-primary text-glow-blue">DOMINATE?</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-lg font-heading">
              Join the arena and prove you're the best.
            </p>
            <Link to="/auth">
              <Button size="lg" className="gradient-neon glow-blue font-display tracking-wider px-12 h-12 text-sm">
                JOIN NOW <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-neon flex items-center justify-center">
                <Gamepad2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg tracking-wider">NEXUS<span className="text-primary">ARENA</span></span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground font-heading">
              <Link to="/games" className="hover:text-foreground transition-colors">Games</Link>
              <Link to="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link>
              <Link to="/auth" className="hover:text-foreground transition-colors">Sign Up</Link>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 NexusArena. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
