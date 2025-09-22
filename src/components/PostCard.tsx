import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, MoreHorizontal, Eye } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

interface PostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  post: {
    id: string
    creator: {
      id: string
      name: string
      avatar: string
      isVerified?: boolean
      category: string
    }
    content: {
      text?: string
      image?: string
      video?: string
    }
    engagement: {
      likes: number
      comments: number
      views: number
    }
    timestamp: string
    isLiked?: boolean
    isPremium?: boolean
    isTrending?: boolean
  }
}

const PostCard = ({ post, className, style }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likesCount, setLikesCount] = useState(post.engagement.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <Card className={cn("overflow-hidden bg-card/80 backdrop-blur-sm hover:shadow-elevated transition-smooth", className)} style={style}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <Link to={`/creator/${post.creator.id}`} className="flex items-center space-x-3 hover-scale transition-smooth">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.creator.avatar} />
            <AvatarFallback className="bg-gradient-secondary text-white">
              {post.creator.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-foreground">{post.creator.name}</h4>
              {post.creator.isVerified && (
                <div className="w-4 h-4 bg-brand-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">{post.creator.category}</Badge>
              <span className="text-xs text-muted-foreground">{post.timestamp}</span>
            </div>
          </div>
        </Link>
        
        <Button variant="ghost" size="sm" className="hover:bg-muted/50">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <CardContent className="p-0">
        {post.content.text && (
          <div className="px-4 pb-3">
            <p className="text-foreground">{post.content.text}</p>
          </div>
        )}

        {post.content.image && (
          <div className="relative">
            <img 
              src={post.content.image} 
              alt="Post content" 
              className="w-full h-64 object-cover"
            />
            {post.isPremium && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="h-6 w-6" fill="currentColor" />
                  </div>
                  <p className="text-sm font-medium">Premium Content</p>
                  <p className="text-xs opacity-80">Subscribe to view</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Engagement */}
        <div className="p-4 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`flex items-center space-x-2 hover-scale transition-smooth ${
                  isLiked ? 'text-red-500' : 'text-muted-foreground'
                }`}
                onClick={handleLike}
              >
                <Heart 
                  className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} 
                />
                <span className="text-sm font-medium">{formatNumber(likesCount)}</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-muted-foreground hover-scale transition-smooth">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm font-medium">{formatNumber(post.engagement.comments)}</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-muted-foreground hover-scale transition-smooth">
                <Eye className="h-5 w-5" />
                <span className="text-sm font-medium">{formatNumber(post.engagement.views)}</span>
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="text-muted-foreground hover-scale transition-smooth">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostCard