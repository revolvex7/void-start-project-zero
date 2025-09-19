import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Heart, ArrowLeft, Users, Star } from "lucide-react"
import { Link } from "react-router-dom"

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [accountType, setAccountType] = useState<"fan" | "creator">("fan")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log("Signup attempt:", { ...formData, accountType })
  }

  return (
    <div className="min-h-screen bg-gradient-auth flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6 animate-fade-in">
        {/* Back to Home */}
        <Button variant="outline" size="sm" asChild className="mb-4 bg-white/80 hover:bg-white border-white/30">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 hover-scale transition-smooth">
            <Heart className="h-8 w-8 text-brand-primary" fill="currentColor" />
            <span className="text-2xl font-bold text-foreground">[TrueFans]</span>
          </Link>
        </div>

        <Card className="shadow-glow bg-white/95 backdrop-blur-sm border border-white/20">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Join TrueFans</CardTitle>
            <CardDescription>
              Create your account and start your creative journey with amazing creators worldwide
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Account Type Selection */}
            <Tabs value={accountType} onValueChange={(value) => setAccountType(value as "fan" | "creator")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="fan" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Fan Account</span>
                </TabsTrigger>
                <TabsTrigger value="creator" className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Creator Account</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="fan" className="space-y-2 mt-4">
                <h3 className="font-medium text-foreground">Fan Account</h3>
                <p className="text-sm text-muted-foreground">
                  Support your favorite creators, access exclusive content, and join a community of true fans.
                </p>
              </TabsContent>

              <TabsContent value="creator" className="space-y-2 mt-4">
                <h3 className="font-medium text-foreground">Creator Account</h3>
                <p className="text-sm text-muted-foreground">
                  Share your talent, build a following, and earn from your passion. Perfect for artists, musicians, and content creators.
                </p>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                  className="mt-1 rounded border-border"
                  required
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-brand-primary hover:text-brand-primary-light transition-smooth">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-brand-primary hover:text-brand-primary-light transition-smooth">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white hover-scale transition-smooth"
                disabled={!formData.agreeToTerms}
              >
                {accountType === "creator" ? "Start Creating" : "Join as Fan"}
              </Button>
            </form>

            <Separator />

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-brand-primary hover:text-brand-primary-light transition-smooth font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center space-y-2 animate-fade-in">
          <p className="text-xs text-foreground/60">
            🔒 Your data is protected with industry-standard security
          </p>
          <p className="text-xs text-foreground/60">
            🌍 Join 50,000+ creators and fans worldwide on TrueFans
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup