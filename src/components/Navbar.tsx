import { Link } from "wouter";
import { Feather, PlusCircle, LogOut, Shield, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { useUser, useLogout } from "@/hooks/use-auth";

export function Navbar() {
  const { data: user } = useUser();
  const logout = useLogout();

  return (
    <nav className="sticky top-0 z-50 w-full border-b" style={{
      background: 'linear-gradient(180deg, #3b2a1a 0%, #332315 100%)',
      borderBottomColor: 'rgba(180, 140, 80, 0.35)',
    }}>
      {/* Subtle gold trim line at very top */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(200, 165, 100, 0.4) 30%, rgba(200, 165, 100, 0.5) 50%, rgba(200, 165, 100, 0.4) 70%, transparent 95%)' }} />
      
      <div className="max-w-5xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="p-0.5 rounded overflow-hidden">
            <img src="/logo.svg.svg" alt="Blottr logo" className="h-7 w-7 object-contain" />
          </div>
          <span className="font-display font-bold text-xl tracking-wide text-amber-100/90">Blottr</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          {user ? (
            <>
              {user.is_admin && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 text-amber-200/60 hover:text-amber-100 hover:bg-amber-100/8 rounded-md">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs tracking-wider uppercase">Admin</span>
                  </Button>
                </Link>
              )}
              <Link href="/create-post">
                <Button size="sm" className="gap-2 rounded-md wax-seal-btn text-xs tracking-wider uppercase">
                  <Feather className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Write</span>
                </Button>
              </Link>
              <div className="h-5 w-px bg-amber-400/15 mx-1 hidden sm:block" />
              <div className="flex items-center gap-3 ml-0">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-medium text-amber-200/70">{user.username}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} title="Logout" className="rounded-md text-amber-300/40 hover:text-red-300 hover:bg-red-300/10 h-8 w-8">
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-amber-200/60 hover:text-amber-100 hover:bg-amber-100/8 rounded-md text-xs tracking-wider uppercase">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-md wax-seal-btn text-xs tracking-wider uppercase">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
