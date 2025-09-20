import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Star, 
  Shield, 
  CreditCard,
  TrendingUp,
  MessageCircle,
  Play,
  Heart,
  Lock,
  Zap,
  Globe,
  MonitorPlay,
  Palette,
  BarChart3,
  Gift,
  Download,
  Mail
} from "lucide-react"
import { Link } from "react-router-dom"

const Features = () => {
  const features = [
    {
      icon: Users,
      title: "Build Your Community",
      description: "Connect with your most passionate fans and build lasting relationships",
      details: [
        "Direct fan messaging",
        "Community posts and updates", 
        "Fan engagement analytics",
        "Exclusive member perks"
      ],
      color: "bg-gradient-brand"
    },
    {
      icon: MonitorPlay,
      title: "Content Creation Tools",
      description: "Professional tools to create and share amazing content",
      details: [
        "Video & audio uploads",
        "Live streaming capabilities",
        "Photo galleries and albums",
        "Rich text editor for posts"
      ],
      color: "bg-gradient-coral"
    },
    {
      icon: CreditCard,
      title: "Monetization Made Easy",
      description: "Multiple ways to earn from your creative work",
      details: [
        "Subscription tiers",
        "Pay-per-view content",
        "Digital product sales",
        "Fan tips and donations"
      ],
      color: "bg-gradient-gold"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Understand your audience and optimize your content",
      details: [
        "Fan demographics",
        "Content performance metrics",
        "Revenue tracking",
        "Growth analytics"
      ],
      color: "bg-gradient-purple"
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your content and community are safe with enterprise-grade security",
      details: [
        "Content protection",
        "Secure payment processing",
        "Privacy controls",
        "DMCA protection"
      ],
      color: "bg-gradient-secondary"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with fans worldwide with built-in internationalization",
      details: [
        "Multi-currency support",
        "Global payment methods",
        "Language localization",
        "Worldwide content delivery"
      ],
      color: "bg-gradient-modern"
    }
  ]

  const contentTypes = [
    { icon: Play, title: "Videos", description: "Share tutorials, vlogs, and exclusive footage" },
    { icon: MessageCircle, title: "Posts", description: "Write updates, stories, and thoughts" },
    { icon: Palette, title: "Art & Images", description: "Showcase your visual creations" },
    { icon: Gift, title: "Digital Products", description: "Sell courses, ebooks, and resources" },
    { icon: Download, title: "Downloads", description: "Offer exclusive files and resources" },
    { icon: Mail, title: "Newsletter", description: "Send regular updates to subscribers" }
  ]

  return (
    <div className="min-h-screen bg-gradient-modern">
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-6 text-center">
          <Badge variant="secondary" className="mb-6 bg-brand-light/20 text-brand-primary border-brand-primary/20">
            ✨ Everything you need to succeed
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            Powerful Features for
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Creators</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            From content creation to community building, TrueFans provides all the tools 
            you need to turn your passion into a sustainable business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-brand-primary hover:bg-brand-primary-light text-white">
              <Link to="/signup">Start Creating</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Everything You Need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to help creators build, engage, and monetize their communities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-elevated transition-smooth bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-brand-primary mr-3" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Content Types Section */}
      <section className="py-16 bg-gradient-secondary/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Share Any Type of Content</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you create videos, art, music, or written content, TrueFans supports it all
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentTypes.map((type, index) => (
              <Card key={index} className="group hover:shadow-card transition-smooth bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-smooth">
                    <type.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Monetization Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 bg-brand-gold/20 text-brand-primary border-brand-gold/30">
                💰 Monetization
              </Badge>
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Turn Your Passion Into Profit
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Multiple revenue streams to help you build a sustainable creative business
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Subscription Tiers</h3>
                    <p className="text-sm text-muted-foreground">Create multiple membership levels with different perks and pricing</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-coral flex items-center justify-center flex-shrink-0">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Premium Content</h3>
                    <p className="text-sm text-muted-foreground">Offer exclusive content that only paying subscribers can access</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-purple flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Analytics & Insights</h3>
                    <p className="text-sm text-muted-foreground">Track your earnings and optimize your content strategy</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-8 bg-gradient-card border-brand-light/30">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                    <Heart className="h-10 w-10 text-white" fill="currentColor" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">Ready to Start?</h3>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of creators already earning with TrueFans
                  </p>
                  <Button size="lg" className="bg-brand-primary hover:bg-brand-primary-light text-white" asChild>
                    <Link to="/signup">Create Your Page</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Features