import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Play, Users, TrendingUp, Award, Shield, Zap, Heart } from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import Header from "@/components/Header"

// Import hero images
import heroCreators from "@/assets/hero-creators.jpg"
import creatorStudio from "@/assets/creator-studio.jpg"
import creatorPodcast from "@/assets/creator-podcast.jpg"
import creatorArtist from "@/assets/creator-artist.jpg"

const Landing = () => {
  const [currentText, setCurrentText] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const heroTexts = [
    {
      main: "Your wildest",
      sub: "creative reality", 
      description: "Turn your passion into a sustainable income with True Fans, the premium creator platform."
    },
    {
      main: "Build your",
      sub: "creator empire",
      description: "Connect with true fans who value your work and are ready to support your creative journey."
    },
    {
      main: "Creator is now",
      sub: "a career",
      description: "Join thousands of creators who have transformed their passion into a thriving business."
    }
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Loyal Community",
      description: "Build meaningful relationships with supporters who truly value your content"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Sustainable Income",
      description: "Create predictable monthly income through subscriptions and one-time support"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Creator Protection",
      description: "Your content, your rules. Full control over pricing and access"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Powerful Tools",
      description: "Everything you need to create, share, and monetize your content effectively"
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section - Patreon Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 gradient-patreon"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20"></div>
        
        {/* Floating background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl animate-patreon-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl animate-patreon-float" style={{animationDelay: '1s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Animated Hero Text */}
            <div className="space-y-6 mb-12">
              <h1 className="text-7xl md:text-9xl font-bold leading-tight">
                <span 
                  key={`main-${currentText}`}
                  className="block text-reveal animate-text-reveal text-white"
                >
                  {heroTexts[currentText].main}
                </span>
                <span 
                  key={`sub-${currentText}`}
                  className="block text-reveal animate-text-reveal text-white"
                  style={{animationDelay: '0.3s'}}
                >
                  {heroTexts[currentText].sub}
                </span>
              </h1>
              
              <p 
                key={`desc-${currentText}`}
                className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-slide-up-text"
                style={{animationDelay: '0.6s'}}
              >
                {heroTexts[currentText].description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-white text-brand-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold hover-lift"
                asChild
              >
                <Link to="/signup">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg hover-lift"
                asChild
              >
                <Link to="/creators">
                  <Play className="mr-2 h-5 w-5" />
                  Explore Creators
                </Link>
              </Button>
            </div>

            {/* Creator Showcase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
              {[
                { image: creatorStudio, name: "Alex Studio", type: "Music Producer", earnings: "$12K/month" },
                { image: creatorPodcast, name: "Sarah Talks", type: "Podcast Host", earnings: "$8K/month" },
                { image: creatorArtist, name: "Art by Maya", type: "Digital Artist", earnings: "$15K/month" }
              ].map((creator, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 hover-lift">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-brand-primary rounded-full mb-4 mx-auto"></div>
                    <h3 className="font-semibold text-white mb-1">{creator.name}</h3>
                    <p className="text-white/70 text-sm mb-2">{creator.type}</p>
                    <div className="text-brand-accent font-bold">{creator.earnings}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent"> succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful tools and features designed to help creators build sustainable businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover-lift bg-gradient-card border-white/10">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 gradient-modern">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { number: "100K+", label: "Active Creators", icon: <Users className="h-8 w-8 mx-auto mb-4 text-brand-primary" /> },
              { number: "$50M+", label: "Paid to Creators", icon: <TrendingUp className="h-8 w-8 mx-auto mb-4 text-brand-accent" /> },
              { number: "5M+", label: "Happy Supporters", icon: <Heart className="h-8 w-8 mx-auto mb-4 text-brand-coral" /> }
            ].map((stat, index) => (
              <div key={index} className="group">
                {stat.icon}
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:animate-morph-text">{stat.number}</div>
                <div className="text-muted-foreground text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8">
            <Award className="h-16 w-16 mx-auto text-brand-primary" />
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to turn your passion into
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent"> profit?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of creators who have already built thriving businesses with True Fans
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold hover-lift patreon-glow" asChild>
                <Link to="/signup">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg hover-lift" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing