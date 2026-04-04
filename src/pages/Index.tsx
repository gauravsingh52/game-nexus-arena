import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gamepad2, Trophy, Zap, Users, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import { gamesData } from "@/data/games";

const features = [
  { icon: Gamepad2, title: "5+ Mini-Games", desc: "Puzzle, arcade, strategy & action games", color: "text-neon-blue" },
  { icon: Trophy, title: "Live Leaderboards", desc: "Compete globally in real-time", color: "text-neon-purple" },
  { icon: Zap, title: "Earn Rewards", desc: "Points, badges & achievements", color: "text-neon-green" },
  { icon: Users, title: "Social Play", desc: "Add friends & compare scores", color: "text-neon-pink" },
];

const Index = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(220_90%_56%/0.12),transparent_60%)]" />
        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-wider mb-6">
              PLAY. <span className="text-primary text-glow-blue">COMPETE.</span>{" "}
              <span className="text-secondary text-glow-purple">DOMINATE.</span>
            </h1>
            <p className="font-heading text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              The ultimate online gaming arena. Play mini-games, climb leaderboards,
              earn achievements, and challenge your friends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/games">
                <Button size="lg" className="gradient-neon glow-blue font-display tracking-wider text-sm px-8">
                  START PLAYING <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button size="lg" variant="outline" className="font-display tracking-wider text-sm border-primary/30 hover:bg-primary/10">
                  VIEW LEADERBOARD
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
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

      {/* Featured Games */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-wider">
                FEATURED <span className="text-primary">GAMES</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Jump into action with our most popular games</p>
            </div>
            <Link to="/games">
              <Button variant="ghost" className="font-heading text-primary">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamesData.slice(0, 3).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <Star className="h-10 w-10 text-neon-orange mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold tracking-wider mb-4">
              READY TO <span className="text-primary text-glow-blue">COMPETE?</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Create your account and start climbing the ranks today.
            </p>
            <Link to="/auth">
              <Button size="lg" className="gradient-neon glow-blue font-display tracking-wider">
                JOIN NOW
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-primary" />
            <span className="font-display tracking-wider">NEXUS<span className="text-primary">ARENA</span></span>
          </div>
          <p>© 2026 NexusArena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
