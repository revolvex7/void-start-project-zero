import { useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Heart, 
  Users, 
  Star, 
  MessageCircle,
  Share2,
  Play,
  Lock,
  Calendar,
  MapPin,
  ExternalLink,
  Gift,
  Image as ImageIcon,
  Music,
  Video
} from "lucide-react"
import SubscriptionModal from "@/components/SubscriptionModal"
import creator1 from "@/assets/creator-avatar-1.jpg"
import creatorStudio from "@/assets/creator-studio.jpg"

const CreatorProfile = () => {
  const { id } = useParams()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  // Sample creator data - in real app this would come from API based on ID
  const creator = {
    id: id || "1",
    name: "Sarah Johnson",
    username: "@sarahjohnson",
    avatar: creator1,
    coverImage: creatorStudio,
    category: "Fashion & Style",
    bio: "Fashion designer and stylist sharing exclusive styling tips, behind-the-scenes content, and personal fashion journey. Join me for weekly styling sessions and exclusive fashion hauls!",
    location: "New York, USA",
    joinedDate: "January 2023",
    subscribers: 2500,
    posts: 145,
    rating: 4.9,
    monthlyPrice: 15,
    isVerified: true,
    socialLinks: {
      website: "https://sarahjohnson.com",
      instagram: "@sarahjohnson_style",
      twitter: "@sarahjohnson"
    },
    subscriptionTiers: [
      {
        id: 1,
        name: "Basic Supporter",
        price: 15,
        description: "Access to exclusive posts and community",
        features: [
          "Exclusive fashion posts",
          "Monthly styling tips",
          "Community access",
          "Behind-the-scenes content"
        ]
      },
      {
        id: 2,
        name: "Style Insider",
        price: 25,
        description: "Everything in Basic + personalized advice",
        features: [
          "Everything in Basic",
          "Monthly 1-on-1 styling session",
          "Personalized outfit recommendations",
          "Early access to content",
          "Exclusive discount codes"
        ]
      },
      {
        id: 3,
        name: "VIP Stylist",
        price: 50,
        description: "Complete styling experience",
        features: [
          "Everything in Style Insider",
          "Weekly video calls",
          "Personal shopping assistance",
          "Custom style guide",
          "Priority support"
        ]
      }
    ]
  }

  // Sample content - mix of free and premium
  const posts = [
    {
      id: 1,
      type: "image",
      title: "Spring Fashion Trends 2024",
      description: "My top 10 spring fashion picks that will elevate your wardrobe this season.",
      thumbnail: creatorStudio,
      isPremium: false,
      likes: 127,
      comments: 23,
      publishedAt: "2 days ago"
    },
    {
      id: 2,
      type: "video",
      title: "Complete Styling Session: Office to Evening",
      description: "Watch me transform a simple office look into a stunning evening outfit.",
      thumbnail: creatorStudio,
      isPremium: true,
      likes: 89,
      comments: 15,
      publishedAt: "1 week ago"
    },
    {
      id: 3,
      type: "text",
      title: "My Personal Style Journey",
      description: "How I discovered my personal style and tips for finding yours.",
      isPremium: false,
      likes: 156,
      comments: 31,
      publishedAt: "2 weeks ago"
    },
    {
      id: 4,
      type: "video",
      title: "Exclusive Haul: Designer Pieces Under $100",
      description: "My latest fashion finds that look expensive but won't break the bank.",
      thumbnail: creatorStudio,
      isPremium: true,
      likes: 203,
      comments: 45,
      publishedAt: "3 weeks ago"
    }
  ]

  const handleSubscribe = (tierId?: number) => {
    setShowSubscriptionModal(true)
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const formatSubscribers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video
      case 'image':
        return ImageIcon
      case 'audio':
        return Music
      default:
        return MessageCircle
    }
  }

  return (
    <div className="min-h-screen bg-gradient-modern">
      {/* Cover & Profile Section */}
      <section className="relative">
        {/* Cover Image */}
        <div className="h-64 md:h-80 bg-gradient-hero relative overflow-hidden">
          {creator.coverImage ? (
            <img 
              src={creator.coverImage} 
              alt={`${creator.name} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-hero" />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Profile Info */}
        <div className="container mx-auto px-6">
          <div className="relative -mt-20 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-background">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback className="text-2xl">{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {creator.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center border-2 border-background">
                    <Star className="w-4 h-4 text-white" fill="currentColor" />
                  </div>
                )}
              </div>

              {/* Creator Info */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-foreground">{creator.name}</h1>
                  <Badge variant="secondary" className="bg-brand-light/20 text-brand-primary border-brand-primary/20">
                    {creator.category}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{creator.username}</p>
                <p className="text-foreground max-w-2xl">{creator.bio}</p>
                
                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{formatSubscribers(creator.subscribers)} fans</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{creator.posts} posts</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-brand-gold" fill="currentColor" />
                    <span>{creator.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{creator.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {creator.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant={isFollowing ? "secondary" : "outline"}
                  onClick={handleFollow}
                  className="min-w-[120px]"
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current text-brand-primary' : ''}`} />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button onClick={() => handleSubscribe()} className="bg-brand-primary hover:bg-brand-primary-light text-white min-w-[120px]">
                  Subscribe
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="tiers">Tiers</TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => {
                  const ContentIcon = getContentIcon(post.type)
                  return (
                    <Card key={post.id} className="group overflow-hidden hover:shadow-elevated transition-smooth bg-card/50 backdrop-blur-sm">
                      {post.thumbnail && (
                        <div className="relative h-48 bg-gradient-secondary">
                          <img 
                            src={post.thumbnail} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-smooth" />
                          
                          {/* Premium Lock */}
                          {post.isPremium && !isSubscribed && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <div className="text-center text-white">
                                <Lock className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm font-medium">Premium Content</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Content Type Icon */}
                          <div className="absolute top-3 left-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                            <ContentIcon className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-foreground group-hover:text-brand-primary transition-smooth line-clamp-2">
                            {post.title}
                          </h3>
                          {post.isPremium && (
                            <Badge variant="secondary" className="bg-brand-gold/20 text-brand-primary ml-2 flex-shrink-0">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{post.publishedAt}</span>
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center space-x-1">
                              <Heart className="w-3 h-3" />
                              <span>{post.likes}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MessageCircle className="w-3 h-3" />
                              <span>{post.comments}</span>
                            </span>
                          </div>
                        </div>

                        {post.isPremium && !isSubscribed && (
                          <Button 
                            size="sm" 
                            className="w-full mt-3 bg-brand-primary hover:bg-brand-primary-light text-white"
                            onClick={() => handleSubscribe()}
                          >
                            Subscribe to View
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="p-6 bg-card/50 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">About {creator.name}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {creator.bio}
                    </p>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card className="p-6 bg-card/50 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Connect</h3>
                    <div className="space-y-3">
                      {creator.socialLinks.website && (
                        <a href={creator.socialLinks.website} target="_blank" rel="noopener noreferrer" 
                           className="flex items-center space-x-2 text-muted-foreground hover:text-brand-primary transition-smooth">
                          <ExternalLink className="w-4 h-4" />
                          <span>Website</span>
                        </a>
                      )}
                      {creator.socialLinks.instagram && (
                        <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-brand-primary transition-smooth">
                          <ExternalLink className="w-4 h-4" />
                          <span>Instagram: {creator.socialLinks.instagram}</span>
                        </a>
                      )}
                      {creator.socialLinks.twitter && (
                        <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-brand-primary transition-smooth">
                          <ExternalLink className="w-4 h-4" />
                          <span>Twitter: {creator.socialLinks.twitter}</span>
                        </a>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Subscription Tiers Tab */}
            <TabsContent value="tiers" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {creator.subscriptionTiers.map((tier, index) => (
                  <Card key={tier.id} className={`relative overflow-hidden transition-smooth hover:shadow-elevated ${
                    index === 1 ? 'ring-2 ring-brand-primary shadow-glow' : ''
                  } bg-card/50 backdrop-blur-sm`}>
                    {index === 1 && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-primary text-white text-center py-2 text-sm font-semibold">
                        Most Popular
                      </div>
                    )}
                    
                    <CardHeader className={index === 1 ? "pt-12" : ""}>
                      <CardTitle className="text-xl text-foreground">{tier.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">{tier.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-foreground">${tier.price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <Button 
                        size="lg" 
                        className={`w-full ${
                          index === 1 
                            ? 'bg-brand-primary hover:bg-brand-primary-light text-white' 
                            : 'bg-muted hover:bg-muted/80 text-foreground'
                        }`}
                        onClick={() => handleSubscribe(tier.id)}
                      >
                        Choose {tier.name}
                      </Button>

                      <div className="space-y-2">
                        {tier.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-brand-primary flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        creator={creator}
        onSubscribe={(tierId) => {
          console.log('Subscribed to tier:', tierId)
          setIsSubscribed(true)
          setShowSubscriptionModal(false)
        }}
      />
    </div>
  )
}

export default CreatorProfile