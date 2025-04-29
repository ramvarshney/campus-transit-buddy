
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-bold text-primary">
            CampusRide
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/" className="font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/student" className="font-medium hover:text-primary transition-colors">
            Student Panel
          </Link>
          <Link to="/driver" className="font-medium hover:text-primary transition-colors">
            Driver Panel
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
