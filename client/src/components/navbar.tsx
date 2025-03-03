import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">BoostIQ Pro</span>
          </a>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/premium">
            <Button variant="default" size="sm">
              Go Premium
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
