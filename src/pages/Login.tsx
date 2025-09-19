import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Heart, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-auth flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
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
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your TrueFans account and continue supporting amazing creators
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
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
                    placeholder="Enter your password"
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-brand-primary hover:text-brand-primary-light transition-smooth"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" size="lg" className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white hover-scale transition-smooth">
                Sign In
              </Button>
            </form>

            <Separator />

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-brand-primary hover:text-brand-primary-light transition-smooth font-medium"
                >
                  Sign up here
                </Link>
              </p>
              
              <p className="text-sm text-muted-foreground">
                Want to become a creator?{" "}
                <Link 
                  to="/creator-signup" 
                  className="text-brand-primary hover:text-brand-primary-light transition-smooth font-medium"
                >
                  Join as Creator
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center space-y-2 animate-fade-in">
          <p className="text-xs text-foreground/60">
            🔒 Secured with 256-bit SSL encryption
          </p>
          <p className="text-xs text-foreground/60">
            🌍 Trusted by 50,000+ creators and fans worldwide
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login