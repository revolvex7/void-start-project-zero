import { Button } from "@/components/ui/button"
import { Heart, Search } from "lucide-react"
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/40">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="h-7 w-7 text-brand-primary" fill="currentColor" />
          <span className="text-xl font-bold text-foreground">[TrueFans]</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/creators" 
            className="text-foreground/70 hover:text-foreground transition-smooth font-medium text-sm"
          >
            Creators
          </Link>
          <Link 
            to="/features" 
            className="text-foreground/70 hover:text-foreground transition-smooth font-medium text-sm"
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            className="text-foreground/70 hover:text-foreground transition-smooth font-medium text-sm"
          >
            Pricing
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex rounded-full">
            <Search className="mr-2 h-4 w-4" />
            Find a Creator
          </Button>
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link to="/login">Log In</Link>
          </Button>
          <Button size="sm" asChild className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header