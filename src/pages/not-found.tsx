import { BookX } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{
      background: 'linear-gradient(180deg, #faf6ee 0%, #f0e6d4 100%)',
    }}>
      <div className="text-center max-w-md mx-4 px-8 py-12">
        <BookX className="w-16 h-16 text-amber-800/25 mx-auto mb-6" />
        <h1 className="text-5xl font-display font-bold mb-3" style={{ color: 'hsl(25, 35%, 18%)' }}>
          404
        </h1>
        <p className="font-display text-2xl text-amber-800/50 mb-2">
          Page Not Found
        </p>
        <p className="text-sm text-amber-800/35 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-amber-800/60 hover:text-amber-900 underline decoration-amber-800/20 underline-offset-4 hover:decoration-amber-800/50 transition-colors">
          Back to home
        </Link>
      </div>
    </div>
  );
}
