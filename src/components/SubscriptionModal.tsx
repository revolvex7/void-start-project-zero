import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Star, 
  Heart, 
  CreditCard, 
  Shield, 
  X,
  Check,
  Crown,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SubscriptionTier {
  id: number
  name: string
  price: number
  description: string
  features: string[]
}

interface Creator {
  id: string
  name: string
  avatar: string
  category: string
  isVerified?: boolean
  subscriptionTiers: SubscriptionTier[]
}

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  creator: Creator
  onSubscribe: (tierId: number) => void
}

const SubscriptionModal = ({ isOpen, onClose, creator, onSubscribe }: SubscriptionModalProps) => {
  const [selectedTier, setSelectedTier] = useState<string>(creator.subscriptionTiers[0]?.id.toString() || "1")
  const [step, setStep] = useState<'select' | 'payment'>('select')

  const selectedTierData = creator.subscriptionTiers.find(tier => tier.id.toString() === selectedTier)

  const handleContinue = () => {
    if (step === 'select') {
      setStep('payment')
    } else {
      onSubscribe(parseInt(selectedTier))
    }
  }

  const handleSkip = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 overflow-y-auto max-h-[90vh] rounded-lg shadow-lg">
        <DialogHeader className="relative p-6 bg-gradient-brand text-white">
          <div className="text-center space-y-3">
            <Avatar className="w-20 h-20 mx-auto border-4 border-white shadow-md">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback className="text-xl font-bold bg-white text-brand-primary">
                {creator.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              Subscribe to {creator.name}
              {creator.isVerified && (
                <Star className="w-5 h-5 text-brand-gold" fill="currentColor" />
              )}
            </DialogTitle>
            <DialogDescription className="text-white/90 text-sm">
              {step === 'select' 
                ? `Unlock exclusive content from ${creator.name} in their ${creator.category} journey.`
                : 'Confirm your subscription details and complete your payment.'
              }
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="p-6">
          {step === 'select' ? (
            <div className="space-y-6">
              {/* Subscription Tiers */}
              <RadioGroup value={selectedTier} onValueChange={setSelectedTier} className="grid md:grid-cols-2 gap-4">
                {creator.subscriptionTiers.map((tier, index) => (
                  <div key={tier.id} className="relative">
                    <RadioGroupItem value={tier.id.toString()} id={tier.id.toString()} className="sr-only" />
                    <Label 
                      htmlFor={tier.id.toString()} 
                      className={cn(
                        "block cursor-pointer rounded-lg border-2 p-5 transition-all h-full",
                        selectedTier === tier.id.toString()
                          ? "border-brand-primary ring-2 ring-brand-primary shadow-lg bg-brand-light/10"
                          : "border-muted-foreground/20 hover:border-brand-primary/50"
                      )}
                    >
                      {index === 1 && (
                        <Badge variant="default" className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                          <Crown className="w-3 h-3 mr-1" /> Most Popular
                        </Badge>
                      )}
                      <CardHeader className={cn("pb-3", index === 1 && "pt-8")}>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold text-foreground">{tier.name}</CardTitle>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-foreground">${tier.price}</span>
                            <span className="text-sm text-muted-foreground">/month</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{tier.description}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {tier.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Check className="w-4 h-4 text-brand-primary flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          {tier.features.length > 3 && (
                            <p className="text-sm text-muted-foreground mt-1">
                              <Zap className="w-3 h-3 inline-block mr-1 text-brand-accent" /> +{tier.features.length - 3} more exclusive features
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Benefits */}
              <Card className="bg-gradient-card border-brand-light/30 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-brand-primary" />
                    What you'll get
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Check className="w-3 h-3 text-brand-primary flex-shrink-0" />
                      <span>Exclusive content access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3 h-3 text-brand-primary flex-shrink-0" />
                      <span>Direct creator interaction</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3 h-3 text-brand-primary flex-shrink-0" />
                      <span>Support your favorite creator</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3 h-3 text-brand-primary flex-shrink-0" />
                      <span>Cancel anytime</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleContinue} 
                  className="w-full bg-brand-primary hover:bg-brand-primary-light text-white rounded-full transition-all hover-glow"
                  size="lg"
                >
                  Continue to Payment
                </Button>
                <Button variant="ghost" onClick={handleSkip} className="w-full text-muted-foreground hover:bg-muted/10 rounded-full">
                  Maybe Later
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected Tier Summary */}
              {selectedTierData && (
                <Card className="bg-brand-light/10 border-brand-primary/20 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{selectedTierData.name}</h3>
                      <div className="text-right">
                        <span className="text-xl font-bold text-foreground">${selectedTierData.price}</span>
                        <span className="text-sm text-muted-foreground">/month</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedTierData.description}</p>
                  </CardContent>
                </Card>
              )}

              <Separator />

              {/* Payment Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-brand-primary" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CreditCard className="w-4 h-4 text-brand-primary" />
                  <span>Cancel anytime, no hidden fees</span>
                </div>
              </div>

              {/* Mock Payment Form */}
              <Card className="bg-card/50 backdrop-blur-sm shadow-sm">
                <CardContent className="p-4 text-center">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-brand-primary" />
                  <p className="text-sm text-muted-foreground mb-4">
                    In a real application, this would integrate with a payment processor like Stripe or PayPal.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Demo Mode: Click "Complete Subscription" to simulate payment
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleContinue} 
                  className="w-full bg-brand-primary hover:bg-brand-primary-light text-white rounded-full transition-all hover-glow"
                  size="lg"
                >
                  Complete Subscription
                </Button>
                <Button variant="outline" onClick={() => setStep('select')} className="w-full rounded-full hover-lift">
                  Back to Tiers
                </Button>
                <Button variant="ghost" onClick={handleSkip} className="w-full text-muted-foreground hover:bg-muted/10 rounded-full">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SubscriptionModal