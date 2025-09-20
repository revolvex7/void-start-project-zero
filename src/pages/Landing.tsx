import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  Users, 
  Star, 
  Shield, 
  CreditCard,
  TrendingUp,
  MessageCircle,
  Play,
  ChevronRight,
  Zap,
  Globe,
  Lock
} from "lucide-react"
import { Link } from "react-router-dom"
import CreatorCard from "@/components/CreatorCard"
import heroCreators from "@/assets/hero-creators.jpg"
import creatorStudio from "@/assets/creator-studio.jpg"
import creatorPodcast from "@/assets/creator-podcast.jpg"
import creatorArtist from "@/assets/creator-artist.jpg"
import creator1 from "@/assets/creator-avatar-1.jpg"
import creator2 from "@/assets/creator-avatar-2.jpg"
import creator3 from "@/assets/creator-avatar-3.jpg"

const Landing = () => {
  // Sample creator data
  const featuredCreators = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: creator1,
      category: "Fashion & Style",
      subscribers: 2500,
      monthlyPrice: 15,
      rating: 4.9,
      isVerified: true,
      bio: "Fashion designer sharing exclusive styling tips and behind-the-scenes content."
    },
    {
      id: "2", 
      name: "Alex Rivera",
      avatar: creator2,
      category: "Music & Audio",
      subscribers: 1800,
      monthlyPrice: 20,
      rating: 4.8,
      bio: "Independent artist offering exclusive tracks, live sessions, and music creation insights."
    },
    {
      id: "3",
      name: "Maya Chen", 
      avatar: creator3,
      category: "Art & Design",
      subscribers: 950,
      monthlyPrice: 12,
      rating: 4.7,
      bio: "Digital artist creating stunning artwork and comprehensive tutorials."
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
      title: "Instant Payments",
      description: "Send tips and support instantly to creators you love. Quick, secure, and hassle-free.",
      color: "text-brand-gold"
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Advanced security with global payment integration. Your transactions are always protected.",
      color: "text-brand-primary"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with creators and fans from around the world in our thriving community.",
      color: "text-brand-purple"
    }
  ]

  const stats = [
    { value: "50K+", label: "Active Fans" },
    { value: "2K+", label: "Creators" },
    { value: "$2M+", label: "Paid to Creators" },
    { value: "99.9%", label: "Uptime" }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroCreators})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        
        <div className="relative container mx-auto px-6 py-32 lg:py-40 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center space-y-8 text-white">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                [TrueFans]
              </h1>
              <p className="text-2xl lg:text-3xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed">
                Behind-the-scenes, <span className="text-brand-light">early releases</span>, unfiltered thoughts
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" asChild className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full px-8">
                <Link to="/explore">
                  <Users className="mr-2 h-5 w-5" />
                  Find Creators
                </Link>
              </Button>
              <Button size="lg" asChild className="bg-white text-brand-primary hover:bg-white/90 rounded-full px-8">
                <Link to="/creator-signup">
                  <Star className="mr-2 h-5 w-5" />
                  Start Creating
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 max-w-2xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl lg:text-4xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/70 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 bg-gradient-modern">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                TrueFans is the best place to build a family with your fans, share exclusive work, and earn money from showcasing your talent to the world
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of creators who are building sustainable careers by connecting directly with their most passionate supporters.
              </p>
              <Button size="lg" asChild className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full hover-scale">
                <Link to="/signup">
                  Get Started Today
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 animate-scale-in">
              <div className="space-y-4">
                <img 
                  src={creatorPodcast} 
                  alt="Content creator recording podcast" 
                  className="rounded-2xl aspect-[3/4] object-cover shadow-card hover-scale transition-smooth"
                />
                <img 
                  src={creatorArtist} 
                  alt="Digital artist creating content" 
                  className="rounded-2xl aspect-square object-cover shadow-card hover-scale transition-smooth"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img 
                  src={creatorStudio} 
                  alt="Professional creator studio setup" 
                  className="rounded-2xl aspect-square object-cover shadow-card hover-scale transition-smooth"
                />
                <img 
                  src={heroCreators} 
                  alt="Community of creators collaborating" 
                  className="rounded-2xl aspect-[3/4] object-cover shadow-card hover-scale transition-smooth"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Meet Amazing Creators
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover talented creators sharing exclusive content with their biggest fans
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full">
              <Link to="/explore">
                View All Creators
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Why Choose TrueFans?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The platform built for creators who want to build meaningful connections with their audience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={feature.title} className="text-center shadow-card hover:shadow-glow transition-smooth hover-scale animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-secondary ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="space-y-8 text-white animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Join thousands of creators and fans building meaningful connections. 
              Your community is waiting for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="xl" className="bg-white text-brand-primary hover:bg-white/90 rounded-full px-8 hover-scale" asChild>
                <Link to="/signup">
                  <Heart className="mr-2 h-5 w-5" />
                  Join as a Fan
                </Link>
              </Button>
              <Button size="xl" className="bg-brand-primary text-white hover:bg-brand-primary/90 rounded-full px-8 hover-scale" asChild>
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