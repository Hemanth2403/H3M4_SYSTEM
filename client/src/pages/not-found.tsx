import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md w-full glass-panel p-8 rounded-xl text-center border border-destructive/20">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-destructive/10 mb-6 ring-1 ring-destructive/30 animate-pulse">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
        
        <h1 className="text-4xl font-mono font-bold mb-2 text-destructive">404</h1>
        <h2 className="text-xl font-heading font-semibold mb-4">Sector Not Found</h2>
        
        <p className="text-muted-foreground mb-8">
          The requested intelligence sector does not exist or you lack the required clearance level.
        </p>

        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors w-full cursor-pointer">
          Return to Base
        </Link>
      </div>
    </div>
  );
}