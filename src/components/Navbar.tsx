
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ActivitySquare, ScanSearch, User, Dumbbell, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const location = useLocation();

  // Close menu when changing route
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const links = [
    { name: "Scanner", href: "/", icon: ScanSearch },
    { name: "Results", href: "/results", icon: ActivitySquare },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Fitness Goals", href: "/goals", icon: Dumbbell },
  ];

  return (
    <nav className="glass fixed top-4 left-1/2 transform -translate-x-1/2 z-50 py-2 px-4 rounded-full w-[90%] max-w-3xl mx-auto transition-all duration-300 backdrop-blur-xl bg-white/70 dark:bg-black/40 border border-white/20 dark:border-white/10 shadow-lg">
      <div className="flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-semibold text-lg tracking-tight"
        >
          <ScanSearch className="h-5 w-5 text-primary" />
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            NutriScanner
          </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? "bg-primary/10 text-primary dark:bg-primary/20" 
                    : "text-foreground/60 hover:text-foreground hover:bg-background/80"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full hover:bg-primary/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full mt-2 py-2 px-4 glass rounded-xl overflow-hidden animate-scale-in">
          <div className="flex flex-col space-y-2 py-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-primary/10 text-primary dark:bg-primary/20" 
                      : "text-foreground/70 hover:text-foreground hover:bg-background/80"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
