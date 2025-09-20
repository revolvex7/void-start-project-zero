import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Check, 
  Star, 
  Zap,
  Crown,
  Heart,
  TrendingUp,
  Users,
  BarChart3,
  Shield,
  Headphones
} from "lucide-react"
import { Link } from "react-router-dom"

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for new creators just getting started",
      price: "Free",
      period: "forever",
      icon: Heart,
      gradient: "bg-gradient-secondary",
      popular: false,
      features: [
        "Up to 100 fans",
        "Basic content sharing",
        "Community posts",
        "Mobile app access",
        "Basic analytics",
        "Email support"
      ],
      limitations: [
        "Limited customization",
        "TrueFans branding",
        "Basic support only"
      ]
    },
    {
      name: "Creator",
      description: "Ideal for growing creators building their community",
      price: "$15",
      period: "per month",
      icon: Star,
      gradient: "bg-gradient-primary",
      popular: true,
      features: [
        "Unlimited fans",
        "All content types",
        "Custom branding",
        "Advanced analytics",
        "Multiple subscription tiers",
        "Fan messaging",
        "Priority support",
        "Mobile & desktop apps",
        "Payment processing",
        "Content protection"
      ],
      limitations: []
    },
    {
      name: "Pro",
      description: "Advanced features for established creators",
      price: "$45",
      period: "per month",
      icon: Crown,
      gradient: "bg-gradient-gold",
      popular: false,
      features: [
        "Everything in Creator",
        "Advanced customization",
        "API access",
        "White-label options",
        "Advanced integrations",
        "Dedicated account manager",
        "Custom domain",
        "Advanced fan segmentation",
        "A/B testing tools",
        "Priority feature requests"
      ],
      limitations: []
    }
  ]

  const faqs = [
    {
      question: "What percentage does TrueFans take?",
      answer: "We take a small 5% platform fee on paid subscriptions. This helps us maintain the platform and continue developing new features for creators."
    },
    {
      question: "Can I change plans anytime?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. For fans, we support local payment methods in most countries."
    },
    {
      question: "Is there a long-term contract?",
      answer: "No contracts required! All plans are month-to-month and you can cancel anytime without penalties."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-modern">
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-6 text-center">
          <Badge variant="secondary" className="mb-6 bg-brand-light/20 text-brand-primary border-brand-primary/20">
            💎 Simple, transparent pricing
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            Choose the Perfect Plan for
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Your Journey</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Start free and scale as you grow. All plans include our core features 
            to help you build and monetize your community.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative overflow-hidden transition-smooth hover:shadow-elevated ${
                  plan.popular 
                    ? 'ring-2 ring-brand-primary shadow-glow scale-105' 
                    : 'hover:scale-105'
                } bg-card/50 backdrop-blur-sm`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-primary text-white text-center py-2 text-sm font-semibold">
                    🔥 Most Popular
                  </div>
                )}
                
                <CardHeader className={plan.popular ? "pt-12" : ""}>
                  <div className={`w-12 h-12 rounded-xl ${plan.gradient} flex items-center justify-center mb-4`}>
                    <plan.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground ml-2">/{plan.period}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button 
                    size="lg" 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-brand-primary hover:bg-brand-primary-light text-white' 
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                    asChild
                  >
                    <Link to="/signup">
                      {plan.name === "Starter" ? "Get Started Free" : `Choose ${plan.name}`}
                    </Link>
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">What's included:</h4>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-brand-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-border">
                      <h4 className="font-semibold text-muted-foreground">Limitations:</h4>
                      {plan.limitations.map((limitation, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="h-4 w-4 rounded-full border border-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 bg-gradient-secondary/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Why Creators Choose TrueFans</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of creators who have built successful businesses with our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, title: "85% Average Revenue Growth", desc: "Creators see significant income increase within 6 months" },
              { icon: Users, title: "2M+ Active Fans", desc: "Large, engaged community ready to support creators" },
              { icon: Shield, title: "99.9% Uptime", desc: "Reliable platform you can count on for your business" },
              { icon: Headphones, title: "24/7 Support", desc: "Always here to help you succeed" }
            ].map((stat, index) => (
              <Card key={index} className="text-center p-6 bg-card/80 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">{stat.title}</h3>
                <p className="text-sm text-muted-foreground">{stat.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Got questions? We've got answers.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm">
                <h3 className="font-semibold text-lg mb-3 text-foreground">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Creator Journey?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already building their communities and earning with TrueFans
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="bg-white text-brand-primary hover:bg-white/90">
              <Link to="/signup">Start Free Today</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-brand-primary">
              <Link to="/features">View All Features</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Pricing