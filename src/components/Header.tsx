import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import Logo from "@/components/ui/logo"
import { GlobalSearch } from "./GlobalSearch"
import { Search } from "lucide-react"

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-light/20 bg-gradient-glass backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover-glow transition-smooth">
          <Logo size="md" showText={true} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/explore" 
            className="relative text-foreground/80 hover:text-brand-primary transition-smooth font-medium group"
          >
            Explore
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/creators" 
            className="relative text-foreground/80 hover:text-brand-primary transition-smooth font-medium group"
          >
            Creators
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/features" 
            className="relative text-foreground/80 hover:text-brand-primary transition-smooth font-medium group"
          >
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/how-it-works" 
            className="relative text-foreground/80 hover:text-brand-primary transition-smooth font-medium group"
          >
            How It Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        {/* Auth Buttons and Search */}
        <div className="flex items-center space-x-3">
          <GlobalSearch />
          <Button variant="soft" size="sm" asChild className="hidden sm:inline-flex hover-lift">
            <Link to="/login">Log In</Link>
          </Button>
          <Button variant="hero" size="sm" asChild className="hover-glow">
            <Link to="/signup">Get Started</Link>
          </Button>
          
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden hover-lift">
            {/* <Menu className="h-5 w-5" /> */}
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header