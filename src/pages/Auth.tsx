import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Feather, ArrowRight, Loader2, BookOpen, Bookmark, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useLogin();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ username, password }, {
      onSuccess: () => {
        toast({ title: "Welcome back!" });
        setLocation("/");
      },
      onError: (err: any) => {
        toast({ title: "Login failed", description: err.message, variant: "destructive" });
      }
    });
  };

  return <AuthLayout mode="login" onSubmit={handleSubmit} isPending={login.isPending} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />;
}

export function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const register = useRegister();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({ username, email, password }, {
      onSuccess: () => {
        toast({ title: "Account created!", description: "Please log in to continue." });
        setLocation("/login");
      },
      onError: (err: any) => {
        toast({ title: "Registration failed", description: err.message, variant: "destructive" });
      }
    });
  };

  return <AuthLayout mode="register" onSubmit={handleSubmit} isPending={register.isPending} username={username} setUsername={setUsername} password={password} setPassword={setPassword} email={email} setEmail={setEmail} />;
}

function AuthLayout({ 
  mode, onSubmit, isPending, username, setUsername, password, setPassword, email, setEmail 
}: any) {
  const isLogin = mode === "login";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-auth">
      {/* Left panel — Book cover */}
      <div className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden book-spine" style={{
        background: 'linear-gradient(160deg, #3b2a1a 0%, #4a3525 30%, #2e1f13 70%, #1e150d 100%)',
      }}>
        {/* Leather texture overlay */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />
        
        {/* Gold foil border lines */}
        <div className="absolute inset-6 border border-amber-600/25 rounded-sm pointer-events-none" />
        <div className="absolute inset-8 border border-amber-500/12 rounded-sm pointer-events-none" />
        
        {/* Corner ornaments */}
        <div className="absolute top-7 left-7 w-6 h-6 border-t-2 border-l-2 border-amber-500/35 rounded-tl-sm" />
        <div className="absolute top-7 right-7 w-6 h-6 border-t-2 border-r-2 border-amber-500/35 rounded-tr-sm" />
        <div className="absolute bottom-7 left-7 w-6 h-6 border-b-2 border-l-2 border-amber-500/35 rounded-bl-sm" />
        <div className="absolute bottom-7 right-7 w-6 h-6 border-b-2 border-r-2 border-amber-500/35 rounded-br-sm" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded overflow-hidden bg-amber-900/30 border border-amber-600/30 flex items-center justify-center">
            <img src="/logo.svg.svg" alt="Blottr logo" className="h-full w-full object-cover" />
          </div>
          <span className="font-display font-bold text-2xl text-amber-100/90 tracking-wide">Blottr</span>
        </div>
        
        <div className="relative z-10">
          <div className="mb-6">
            <BookOpen className="w-10 h-10 text-amber-500/50 mb-4" />
          </div>
          <h1 className="text-5xl font-display font-bold mb-6 leading-tight text-amber-50/95" style={{ color: 'rgba(255, 240, 210, 0.92)' }}>
            {isLogin 
              ? "Welcome back to the conversation." 
              : "Join the creative community today."}
          </h1>
          <p className="text-amber-200/50 text-lg max-w-md font-light">
            Express yourself, connect with others, and discover amazing stories from around the world.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between items-center">
          <span className="page-number text-amber-400/30">— i —</span>
          <span className="text-xs text-amber-400/20 tracking-widest uppercase">Est. MMXXVI</span>
        </div>
      </div>

      {/* Right panel — Notebook page */}
      <div className="flex items-center justify-center p-8 relative stitch-binding" style={{
        background: 'linear-gradient(180deg, #faf6ee 0%, #f5efe3 60%, #efe7d8 100%)',
        backgroundImage: `
          repeating-linear-gradient(
            180deg,
            transparent 0px,
            transparent 31px,
            rgba(160, 140, 120, 0.12) 31px,
            rgba(160, 140, 120, 0.12) 32px
          )`,
        backgroundSize: '100% 32px',
      }}>
        {/* Red margin line */}
        <div className="absolute top-0 bottom-0 left-[60px] w-px bg-red-300/25 hidden md:block" />
        
        <Link href="/" className="absolute top-8 right-8 text-sm font-medium text-amber-800/50 hover:text-amber-900 transition-colors flex items-center gap-1 z-10">
          Back to home <ArrowRight className="w-4 h-4" />
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8 relative z-10"
        >
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-display font-bold tracking-tight mb-2" style={{ color: 'hsl(25, 35%, 18%)' }}>
              {isLogin ? "Log in" : "Create an account"}
            </h2>
            <p className="text-amber-800/50 text-sm">
              {isLogin ? "Enter your credentials to access your account." : "Fill in your details to get started."}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1 text-amber-900/60 tracking-wide uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>Username</label>
              <Input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="johndoe" 
                required 
                minLength={3}
                className="bg-white/50 border-amber-800/15 focus:border-amber-700/30 focus:ring-amber-700/10 rounded-lg"
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1 text-amber-900/60 tracking-wide uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>Email</label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="john@example.com" 
                  required
                  className="bg-white/50 border-amber-800/15 focus:border-amber-700/30 focus:ring-amber-700/10 rounded-lg"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1 text-amber-900/60 tracking-wide uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>Password</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                  minLength={5}
                  className="bg-white/50 border-amber-800/15 focus:border-amber-700/30 focus:ring-amber-700/10 rounded-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-900/40 hover:text-amber-900/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full rounded-lg h-14 text-lg wax-seal-btn font-display font-semibold tracking-wide" disabled={isPending}>
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Sign In" : "Sign Up")}
            </Button>
          </form>

          <div className="journal-divider pt-6">
            <p className="text-center text-amber-800/45 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Link href={isLogin ? "/register" : "/login"} className="font-semibold text-amber-800 hover:text-amber-900 underline decoration-amber-800/30 underline-offset-4 hover:decoration-amber-800/60 transition-colors">
                {isLogin ? "Sign up" : "Log in"}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
