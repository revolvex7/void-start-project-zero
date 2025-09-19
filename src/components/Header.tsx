import { Button } from "@/components/ui/button"
import { Heart, User, Menu } from "lucide-react"
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-light/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-brand-primary" fill="currentColor" />
            <span className="text-xl font-bold text-brand-primary">True Fans</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/explore" 
            className="text-foreground/80 hover:text-brand-primary transition-smooth font-medium"
          >
            Explore Creators
          </Link>
          <Link 
            to="/how-it-works" 
            className="text-foreground/80 hover:text-brand-primary transition-smooth font-medium"
          >
            How It Works
          </Link>
          <Link 
            to="/creator-signup" 
            className="text-foreground/80 hover:text-brand-primary transition-smooth font-medium"
          >
            Become a Creator
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Button variant="soft" size="sm" asChild className="hidden sm:inline-flex">
            <Link to="/login">Log In</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
          
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header