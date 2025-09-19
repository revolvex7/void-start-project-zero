import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Star } from "lucide-react"
import { Link } from "react-router-dom"

interface CreatorCardProps {
  creator: {
    id: string
    name: string
    avatar: string
    category: string
    subscribers: number
    monthlyPrice: number
    rating: number
    isVerified?: boolean
    coverImage?: string
    bio: string
  }
}

const CreatorCard = ({ creator }: CreatorCardProps) => {
  const formatSubscribers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-elevated transition-smooth bg-gradient-card border-brand-light/20">
      <div className="relative h-32 bg-gradient-coral">
        {creator.coverImage ? (
          <img 
            src={creator.coverImage} 
            alt={`${creator.name} cover`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-gold" />
        )}
        
        {/* Floating Avatar */}
        <div className="absolute -bottom-6 left-4">
          <div className="relative">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="h-12 w-12 rounded-full border-4 border-background object-cover"
            />
            {creator.isVerified && (
              <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-gold flex items-center justify-center">
                <Star className="h-2.5 w-2.5 text-white" fill="currentColor" />
              </div>
            )}
          </div>
        </div>

        {/* Category Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-3 right-3 bg-background/90 text-brand-primary"
        >
          {creator.category}
        </Badge>
      </div>

      <CardContent className="pt-8 pb-4">
        <div className="space-y-3">
          {/* Creator Info */}
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-brand-primary transition-smooth">
              {creator.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {creator.bio}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{formatSubscribers(creator.subscribers)} fans</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-brand-gold" fill="currentColor" />
              <span>{creator.rating}</span>
            </div>
          </div>

          {/* Pricing & Actions */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm text-muted-foreground">Starting from</p>
              <p className="font-semibold text-brand-primary">
                ₦{creator.monthlyPrice.toLocaleString()}/month
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="soft" size="sm" asChild>
                <Link to={`/creator/${creator.id}`}>
                  <Heart className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
              <Button variant="subscribe" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CreatorCard