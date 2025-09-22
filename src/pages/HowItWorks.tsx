import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Heart,
  Users,
  Star,
  CreditCard,
  Shield,
  TrendingUp,
  MessageCircle,
  Camera,
  Gift,
  CheckCircle
} from "lucide-react"
import { Link } from "react-router-dom"

const HowItWorks = () => {
  const fanSteps = [
    {
      icon: Users,
      title: "Discover Amazing Creators",
      description: "Browse through thousands of talented Nigerian creators across various categories like music, art, fashion, and more.",
      color: "bg-gradient-accent"
    },
    {
      icon: Heart,
      title: "Subscribe & Support",
      description: "Choose subscription tiers that fit your budget and get access to exclusive content from your favorite creators.",
      color: "bg-gradient-secondary"
    },
    {
      icon: Gift,
      title: "Dash Your Favorites",
      description: "Show extra love with tips and donations. Every naira goes directly to supporting the creator's journey.",
      color: "bg-gradient-primary"
    },
    {
      icon: MessageCircle,
      title: "Connect & Engage",
      description: "Chat with creators, comment on posts, and be part of an exclusive community of true fans.",
      color: "bg-gradient-accent"
    }
  ]

  const creatorSteps = [
    {
      icon: Camera,
      title: "Create Your Profile",
      description: "Set up your creator profile with stunning visuals, bio, and showcase your best work to attract fans.",
      color: "bg-gradient-primary"
    },
    {
      icon: Star,
      title: "Share Exclusive Content",
      description: "Post photos, videos, behind-the-scenes content, and offer different subscription tiers for your fans.",
      color: "bg-gradient-secondary"
    },
    {
      icon: TrendingUp,
      title: "Build Your Community",
      description: "Engage with your fans, respond to messages, and grow a loyal community that supports your creative journey.",
      color: "bg-gradient-accent"
    },
    {
      icon: CreditCard,
      title: "Earn & Grow",
      description: "Get paid directly from subscriptions and tips. We handle payments securely while you focus on creating.",
      color: "bg-gradient-primary"
    }
  ]

  const features = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "All transactions are protected with bank-level security. We support multiple payment methods including cards and bank transfers."
    },
    {
      icon: Users,
      title: "Growing Community", 
      description: "Join over 50,000+ creators and fans already using TrueFans to build meaningful connections and businesses."
    },
    {
      icon: TrendingUp,
      title: "Fair Revenue Share",
      description: "We only take 20% platform fee, meaning creators keep 80% of their earnings. No hidden charges or surprises."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-modern">
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-6 text-center">
          <Badge variant="secondary" className="mb-6 bg-brand-light/20 text-brand-primary border-brand-primary/20">
            💡 How TrueFans Works
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            Supporting Creators Has
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Never Been Easier</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            TrueFans connects Nigerian creators with their biggest supporters. 
            Whether you're a fan wanting to support or a creator ready to earn, 
            we make it simple, secure, and rewarding.
          </p>
        </div>
      </section>

      {/* For Fans Section */}
      <section className="py-16 bg-gradient-secondary/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-white" fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">For Fans</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover, support, and connect with amazing Nigerian creators
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fanSteps.map((step, index) => (
              <Card key={index} className="text-center p-6 bg-card/80 backdrop-blur-sm relative overflow-hidden group hover:shadow-elevated transition-smooth">
                <div className="absolute top-4 right-4 text-2xl font-bold text-muted-foreground/20">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-smooth`}>
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Creators Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center mx-auto mb-6">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">For Creators</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Turn your passion into profit with TrueFans creator tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creatorSteps.map((step, index) => (
              <Card key={index} className="text-center p-6 bg-card/80 backdrop-blur-sm relative overflow-hidden group hover:shadow-elevated transition-smooth">
                <div className="absolute top-4 right-4 text-2xl font-bold text-muted-foreground/20">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-smooth`}>
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gradient-secondary/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Why Choose TrueFans?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for the Nigerian creative economy
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8 bg-card/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-4 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Success Stories</h2>
            <p className="text-lg text-muted-foreground">
              See how creators are thriving on TrueFans
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Amara O.", category: "Fashion", earnings: "₦150K/month", growth: "+300% in 6 months" },
              { name: "Kemi A.", category: "Music", earnings: "₦200K/month", growth: "+250% in 4 months" },
              { name: "David O.", category: "Art", earnings: "₦80K/month", growth: "+400% in 8 months" }
            ].map((story, index) => (
              <Card key={index} className="p-6 bg-gradient-primary text-white">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">{story.name}</span>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">{story.category}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-white/90">Currently earning <strong>{story.earnings}</strong></p>
                  <p className="text-white/90">Growth: <strong>{story.growth}</strong></p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators and fans who are already part of the TrueFans community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="bg-white text-brand-primary hover:bg-white/90">
              <Link to="/signup">Join as Fan</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-brand-primary">
              <Link to="/creator-signup">Become a Creator</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks