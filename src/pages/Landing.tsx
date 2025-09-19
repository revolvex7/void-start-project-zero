import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  Users, 
  Star, 
  Shield, 
  Smartphone, 
  CreditCard,
  TrendingUp,
  MessageCircle,
  Play,
  ChevronRight
} from "lucide-react"
import { Link } from "react-router-dom"
import CreatorCard from "@/components/CreatorCard"
import heroImage from "@/assets/hero-image.jpg"
import creator1 from "@/assets/creator-avatar-1.jpg"
import creator2 from "@/assets/creator-avatar-2.jpg"
import creator3 from "@/assets/creator-avatar-3.jpg"

const Landing = () => {
  // Sample creator data
  const featuredCreators = [
    {
      id: "1",
      name: "Amara Okafor",
      avatar: creator1,
      category: "Fashion & Style",
      subscribers: 2500,
      monthlyPrice: 2500,
      rating: 4.9,
      isVerified: true,
      bio: "Nigerian fashion designer sharing exclusive styling tips and behind-the-scenes content."
    },
    {
      id: "2", 
      name: "Kemi Adeleke",
      avatar: creator2,
      category: "Music & Audio",
      subscribers: 1800,
      monthlyPrice: 3000,
      rating: 4.8,
      bio: "Afrobeats artist offering exclusive tracks, live sessions, and music creation insights."
    },
    {
      id: "3",
      name: "David Okonkwo", 
      avatar: creator3,
      category: "Art & Design",
      subscribers: 950,
      monthlyPrice: 2000,
      rating: 4.7,
      bio: "Digital artist creating stunning Nigerian-inspired artwork and tutorials."
    }
  ]

  const features = [
    {
      icon: Heart,
      title: "Support Your Favorites",
      description: "Subscribe to creators and get exclusive content, early access, and direct engagement.",
      color: "text-brand-coral"
    },
    {
      icon: CreditCard,
      title: "Dash Me Feature",
      description: "Send tips instantly to creators you love. Quick, secure, and directly to their wallets.",
      color: "text-brand-gold"
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Advanced security with Nigerian payment integration. Your transactions are always protected.",
      color: "text-brand-primary"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Optimized for Nigerian internet speeds with smart data compression and offline features.",
      color: "text-brand-purple"
    }
  ]

  const stats = [
    { value: "50K+", label: "Active Fans" },
    { value: "2K+", label: "Creators" },
    { value: "₦50M+", label: "Paid to Creators" },
    { value: "99.9%", label: "Uptime" }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-brand">
        <div className="absolute inset-0 bg-black/20" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-white">
              <div className="space-y-4">
                <Badge className="bg-brand-gold/20 text-brand-gold border-brand-gold/30 font-medium">
                  🇳🇬 Made for Nigeria
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Support Nigerian 
                  <span className="block text-brand-coral">Creators</span>
                  <span className="block">You Love</span>
                </h1>
                <p className="text-xl lg:text-2xl text-white/90 max-w-lg">
                  The first creator platform built for Nigeria. Subscribe to exclusive content, 
                  tip your favorites, and join a community of true fans.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/explore">
                    <Users className="mr-2 h-5 w-5" />
                    Explore Creators
                  </Link>
                </Button>
                <Button variant="gold" size="xl" asChild className="bg-brand-gold/20 text-white hover:bg-brand-gold/30 border border-brand-gold/40">
                  <Link to="/creator-signup">
                    <Star className="mr-2 h-5 w-5" />
                    Become a Creator
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-white/80">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="Nigerian creators and fans connecting" 
                  className="rounded-2xl shadow-elevated"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-coral/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Meet Amazing Creators
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover talented Nigerian creators sharing exclusive content with their biggest fans
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/explore">
                View All Creators
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Why Choose True Fans?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built specifically for the Nigerian market with features that matter most
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center shadow-card hover:shadow-elevated transition-smooth">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-brand text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Support Amazing Creators?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of fans already supporting their favorite Nigerian creators. 
              Start your journey today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gold" size="xl" className="bg-brand-gold text-white hover:bg-brand-gold/90" asChild>
                <Link to="/signup">
                  <Heart className="mr-2 h-5 w-5" />
                  Join as a Fan
                </Link>
              </Button>
              <Button variant="soft" size="xl" className="bg-brand-coral/20 text-white hover:bg-brand-coral/30 border border-brand-coral/40" asChild>
                <Link to="/creator-signup">
                  <Star className="mr-2 h-5 w-5" />
                  Start Creating
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing