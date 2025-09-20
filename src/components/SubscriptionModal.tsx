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
  Check
} from "lucide-react"

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
      // Process payment (in real app, integrate with payment processor)
      onSubscribe(parseInt(selectedTier))
    }
  }

  const handleSkip = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-between">
            <div />
            <div className="flex items-center space-x-2">
              <img 
                src={creator.avatar} 
                alt={creator.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <DialogTitle className="text-lg text-foreground flex items-center">
                  {creator.name}
                  {creator.isVerified && (
                    <Star className="w-4 h-4 ml-1 text-brand-gold" fill="currentColor" />
                  )}
                </DialogTitle>
                <Badge variant="secondary" className="text-xs bg-brand-light/20 text-brand-primary">
                  {creator.category}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-center mt-4">
            {step === 'select' 
              ? `Support ${creator.name} and get access to exclusive content`
              : 'Complete your subscription'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'select' ? (
          <div className="space-y-6">
            {/* Subscription Tiers */}
            <RadioGroup value={selectedTier} onValueChange={setSelectedTier} className="space-y-3">
              {creator.subscriptionTiers.map((tier) => (
                <div key={tier.id} className="relative">
                  <RadioGroupItem value={tier.id.toString()} id={tier.id.toString()} className="sr-only" />
                  <Label 
                    htmlFor={tier.id.toString()} 
                    className="cursor-pointer"
                  >
                    <Card className={`transition-smooth hover:shadow-card ${
                      selectedTier === tier.id.toString() 
                        ? 'ring-2 ring-brand-primary shadow-glow bg-brand-light/10' 
                        : 'hover:bg-brand-light/5'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base text-foreground">{tier.name}</CardTitle>
                          <div className="text-right">
                            <span className="text-xl font-bold text-foreground">${tier.price}</span>
                            <span className="text-sm text-muted-foreground">/month</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{tier.description}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-1">
                          {tier.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Check className="w-3 h-3 text-brand-primary flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          {tier.features.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{tier.features.length - 3} more features
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Benefits */}
            <Card className="bg-gradient-card border-brand-light/30">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-brand-primary" />
                  What you'll get
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3 h-3 text-brand-primary" />
                    <span>Exclusive content access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3 h-3 text-brand-primary" />
                    <span>Direct creator interaction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3 h-3 text-brand-primary" />
                    <span>Support your favorite creator</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3 h-3 text-brand-primary" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleContinue} 
                className="w-full bg-brand-primary hover:bg-brand-primary-light text-white"
                size="lg"
              >
                Continue to Payment
              </Button>
              <Button variant="ghost" onClick={handleSkip} className="w-full text-muted-foreground">
                Maybe Later
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Selected Tier Summary */}
            {selectedTierData && (
              <Card className="bg-brand-light/10 border-brand-primary/20">
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
            <Card className="bg-card/50 backdrop-blur-sm">
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
                className="w-full bg-brand-primary hover:bg-brand-primary-light text-white"
                size="lg"
              >
                Complete Subscription
              </Button>
              <Button variant="outline" onClick={() => setStep('select')} className="w-full">
                Back to Tiers
              </Button>
              <Button variant="ghost" onClick={handleSkip} className="w-full text-muted-foreground">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SubscriptionModal