import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Gamepad2, Trophy, Zap, Users, ArrowRight, Shield, Target, Swords, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gamesData } from "@/data/games";
import { useEffect, useRef, useState } from "react";

const useCountUp = (end: number, duration = 2000, startOnView = true) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return { count, ref };
};

const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 30 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full animate-float-particle"
        style={{
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: `hsl(${[220, 270, 160, 330][i % 4]} ${80 + Math.random() * 20}% ${50 + Math.random() * 20}% / ${0.3 + Math.random() * 0.4})`,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${6 + Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
);

const GlitchText = ({ children, className = "" }: { children: string; className?: string }) => (
  <span className={`relative inline-block ${className}`}>
    <span className="glitch-text" data-text={children}>{children}</span>
  </span>
);

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const stats = [
    { ...useCountUp(10), label: "EPIC GAMES", suffix: "+" },
    { ...useCountUp(5000), label: "PLAYERS", suffix: "+" },
    { ...useCountUp(50000), label: "GAMES PLAYED", suffix: "+" },
    { ...useCountUp(24), label: "HOURS / DAY", suffix: "/7" },
  ];

  const [typedText, setTypedText] = useState("");
  const tagline = "Battle. Compete. Dominate.";
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setTypedText(tagline.slice(0, i + 1));
      i++;
      if (i >= tagline.length) clearInterval(timer);
    }, 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen pt-16 overflow-hidden bg-background">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 scanline-overlay opacity-[0.03]" />

      {/* ========== HERO ========== */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center">
        <Particles />
        {/* Radial glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,hsl(220_90%_56%/0.18),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,hsl(270_80%_60%/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(160_80%_45%/0.05),transparent_40%)]" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(hsl(220 90% 56%) 1px, transparent 1px), linear-gradient(90deg, hsl(220 90% 56%) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-neon-green/30 bg-neon-green/5 mb-10"
            >
              <div className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-xs font-display text-neon-green tracking-[0.2em]">LIVE — PLAYERS ONLINE NOW</span>
            </motion.div>

            {/* Main title with glitch */}
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-display text-6xl md:text-8xl lg:text-9xl font-black tracking-wider leading-[0.9] mb-8"
            >
              <span className="block text-foreground/60 text-4xl md:text-5xl lg:text-6xl mb-2 tracking-[0.3em]">ENTER THE</span>
              <GlitchText className="text-primary neon-text-blue">NEXUS</GlitchText>
              <br />
              <GlitchText className="text-secondary neon-text-purple">ARENA</GlitchText>
            </motion.h1>

            {/* Typing tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-heading text-xl md:text-2xl text-muted-foreground tracking-[0.15em] mb-12 h-8"
            >
              {typedText}<span className="animate-pulse text-primary">|</span>
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/auth">
                <Button size="lg" className="relative overflow-hidden gradient-neon glow-blue font-display tracking-[0.2em] text-sm px-12 h-14 group">
                  <span className="relative z-10 flex items-center">
                    START PLAYING <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                </Button>
              </Link>
              <Link to="/games">
                <Button size="lg" variant="outline" className="font-display tracking-[0.2em] text-sm px-12 h-14 border-primary/30 hover:bg-primary/10 hover:border-primary/60 hover:glow-blue transition-all">
                  BROWSE GAMES
                </Button>
              </Link>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-20 flex flex-col items-center gap-2"
            >
              <span className="text-xs text-muted-foreground tracking-[0.2em] font-display">SCROLL DOWN</span>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
                <div className="w-1 h-2 rounded-full bg-primary" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ========== ANIMATED STATS ========== */}
      <section className="py-8 border-y border-border bg-card/40 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        <div className="container relative">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                ref={s.ref}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center py-6"
              >
                <p className="font-display text-3xl md:text-4xl font-black text-primary">
                  {s.count.toLocaleString()}{s.suffix}
                </p>
                <p className="text-xs text-muted-foreground font-display tracking-[0.15em] mt-2">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== GAME SHOWCASE ========== */}
      <section className="py-24 relative">
        <Particles />
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-wider mb-3">
              THE <GlitchText className="text-primary neon-text-blue">GAMES</GlitchText>
            </h2>
            <p className="text-muted-foreground font-heading text-lg tracking-wide">10 mind-bending challenges await</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {gamesData.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="perspective-1000"
              >
                <Link to={game.route}>
                  <div className="group relative p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 cursor-pointer overflow-hidden game-card-hover">
                    {/* Animated border glow */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 neon-border-pulse" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-5xl group-hover:animate-bounce-subtle transition-transform">{game.icon}</span>
                        <span className={`text-[10px] font-display tracking-[0.2em] px-2 py-1 rounded-full border ${
                          game.difficulty === 'easy' ? 'border-neon-green/40 text-neon-green bg-neon-green/10' :
                          game.difficulty === 'medium' ? 'border-neon-orange/40 text-neon-orange bg-neon-orange/10' :
                          'border-neon-pink/40 text-neon-pink bg-neon-pink/10'
                        }`}>{game.difficulty.toUpperCase()}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold tracking-wider mb-1 group-hover:text-primary transition-colors">{game.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{game.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-display tracking-[0.15em] px-2 py-0.5 rounded border border-border bg-muted/50 uppercase">{game.category}</span>
                        <div className="flex items-center gap-1 text-neon-orange">
                          <Star className="h-3 w-3 fill-neon-orange" />
                          <span className="text-xs font-display">{game.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Play icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                      <div className="w-12 h-12 rounded-full gradient-neon flex items-center justify-center glow-blue">
                        <ChevronRight className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
            <Link to="/games">
              <Button variant="outline" size="lg" className="font-display tracking-[0.2em] text-sm border-primary/30 hover:bg-primary/10 hover:border-primary/60 gap-2">
                VIEW ALL GAMES <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-24 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(220_90%_56%/0.06),transparent_60%)]" />
        <div className="container relative">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-wider mb-3">
              HOW IT <GlitchText className="text-neon-green neon-text-green">WORKS</GlitchText>
            </h2>
            <p className="text-muted-foreground font-heading text-lg">Three steps to gaming glory</p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />

            <div className="grid md:grid-cols-3 gap-10">
              {[
                { step: "01", icon: Shield, title: "CREATE ACCOUNT", desc: "Sign up in seconds. Choose your username. Set up your gamer profile and avatar.", color: "primary" },
                { step: "02", icon: Swords, title: "PLAY & COMPETE", desc: "Choose from 10 unique mini-games. Earn points with every win. Beat your personal best.", color: "secondary" },
                { step: "03", icon: Trophy, title: "CLIMB RANKS", desc: "Dominate leaderboards. Unlock achievements. Rise through the ranks to legendary status.", color: "accent" },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.6 }}
                  className="relative group"
                >
                  <div className="text-center p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_60px_hsl(220_90%_56%/0.1)]">
                    {/* Step number */}
                    <div className="relative inline-block mb-6">
                      <span className="font-display text-7xl font-black text-muted/20 group-hover:text-primary/20 transition-colors">{item.step}</span>
                      <item.icon className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-${item.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <h3 className="font-display text-sm font-bold tracking-[0.2em] mb-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-24 border-t border-border relative">
        <div className="container relative">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-wider mb-3">
              WHY <GlitchText className="text-secondary neon-text-purple">NEXUS ARENA</GlitchText>
            </h2>
            <p className="text-muted-foreground font-heading text-lg">Built for gamers, by gamers</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Gamepad2, title: "10+ Games", desc: "Puzzle, arcade, strategy & action categories", color: "text-neon-blue", glow: "group-hover:shadow-[0_0_40px_hsl(220_90%_56%/0.2)]" },
              { icon: Trophy, title: "Live Rankings", desc: "Real-time global leaderboards updated instantly", color: "text-neon-purple", glow: "group-hover:shadow-[0_0_40px_hsl(270_80%_60%/0.2)]" },
              { icon: Zap, title: "Earn Rewards", desc: "Points, badges, achievements & level-ups", color: "text-neon-green", glow: "group-hover:shadow-[0_0_40px_hsl(160_80%_45%/0.2)]" },
              { icon: Users, title: "Social Play", desc: "Add friends, compare scores & compete together", color: "text-neon-pink", glow: "group-hover:shadow-[0_0_40px_hsl(330_85%_60%/0.2)]" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className={`group text-center p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 ${f.glow}`}
              >
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className={`absolute inset-0 rounded-xl bg-current opacity-10 ${f.color} group-hover:animate-pulse`} />
                  <f.icon className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 ${f.color}`} />
                </div>
                <h3 className="font-display text-sm font-bold tracking-[0.15em] mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== MARQUEE SOCIAL PROOF ========== */}
      <section className="py-12 border-t border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-card/30" />
        <div className="relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex items-center gap-8 mx-8">
                {["🏆 xNightHawk reached #1", "⚡ ProGamer99 scored 9800pts", "🧠 MemoryKing beat Memory Match", "🎯 AimBot_X got 98% accuracy", "🔥 SpeedDemon typed 120 WPM", "🐍 SnakeMaster hit level 15", "🧩 QuizWhiz answered 50 straight", "💥 MoleMasher combo x25"].map((msg) => (
                  <span key={msg} className="text-sm font-heading text-muted-foreground/60 flex items-center gap-2">
                    {msg} <span className="text-primary/30">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(270_80%_60%/0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(220_90%_56%/0.08),transparent_40%)]" />
        <Particles />

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            {/* Pulsing icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-20 h-20 mx-auto rounded-2xl gradient-neon flex items-center justify-center glow-blue mb-8"
            >
              <Target className="h-10 w-10 text-primary-foreground" />
            </motion.div>

            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black tracking-wider mb-6">
              READY TO<br />
              <GlitchText className="text-primary neon-text-blue">DOMINATE?</GlitchText>
            </h2>
            <p className="text-muted-foreground mb-10 text-xl font-heading tracking-wide">
              Join thousands of players in the ultimate gaming arena.
            </p>

            <Link to="/auth">
              <Button size="lg" className="relative overflow-hidden gradient-neon glow-blue font-display tracking-[0.25em] px-16 h-16 text-base group">
                <span className="relative z-10 flex items-center">
                  JOIN THE ARENA <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                {/* Ring pulse */}
                <div className="absolute inset-0 rounded-md animate-ping-slow border-2 border-primary/30" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-border relative">
        {/* Neon line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-neon flex items-center justify-center glow-blue">
                <Gamepad2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl tracking-[0.15em]">NEXUS<span className="text-primary">ARENA</span></span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground font-heading tracking-wide">
              <Link to="/games" className="hover:text-primary transition-colors">Games</Link>
              <Link to="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link>
              <Link to="/auth" className="hover:text-primary transition-colors">Sign Up</Link>
            </div>
            <p className="text-xs text-muted-foreground font-heading">© 2026 NexusArena. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
