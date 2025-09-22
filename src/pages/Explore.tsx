import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, TrendingUp } from "lucide-react"
import CreatorCard from "@/components/CreatorCard"
import PostCard from "@/components/PostCard"
import creator1 from "@/assets/creator-avatar-1.jpg"
import creator2 from "@/assets/creator-avatar-2.jpg"
import creator3 from "@/assets/creator-avatar-3.jpg"
import creatorStudio from "@/assets/creator-studio.jpg"
import creatorPodcast from "@/assets/creator-podcast.jpg"
import creatorArtist from "@/assets/creator-artist.jpg"

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  const posts = [
    {
      id: "1",
      creator: {
        id: "1",
        name: "Sarah Johnson",
        avatar: creator1,
        isVerified: true,
        category: "Fashion & Style"
      },
      content: {
        text: "Behind the scenes of my latest photoshoot! This outfit combines traditional Nigerian patterns with modern street style. What do you think? 💫",
        image: creatorArtist
      },
      engagement: {
        likes: 324,
        comments: 42,
        views: 1200
      },
      timestamp: "2h ago",
      isLiked: false,
      isTrending: true
    },
    {
      id: "2",
      creator: {
        id: "2",
        name: "Alex Rivera",
        avatar: creator2,
        isVerified: true,
        category: "Music & Audio"
      },
      content: {
        text: "New Afrobeats track dropping tomorrow! 🎵 Here's a sneak peek of the studio session. My supporters get early access!",
        image: creatorPodcast,
        video: "/video-placeholder.mp4"
      },
      engagement: {
        likes: 892,
        comments: 156,
        views: 3400
      },
      timestamp: "4h ago",
      isLiked: true,
      isPremium: true,
      isTrending: true
    },
    {
      id: "3",
      creator: {
        id: "3",
        name: "Maya Chen",
        avatar: creator3,
        category: "Art & Design"
      },
      content: {
        text: "Digital art piece inspired by Lagos city vibes. Each layer tells a story of our beautiful culture. Process video coming soon for my subscribers! 🎨",
        image: creatorStudio
      },
      engagement: {
        likes: 567,
        comments: 89,
        views: 2100
      },
      timestamp: "6h ago",
      isLiked: false
    },
    {
      id: "4",
      creator: {
        id: "1",
        name: "Sarah Johnson",
        avatar: creator1,
        isVerified: true,
        category: "Fashion & Style"
      },
      content: {
        text: "Quick styling tip: Mix textures to create depth in your outfit! Silk + Cotton + Leather = Magic ✨ More tips in my exclusive tutorials.",
        image: creator1
      },
      engagement: {
        likes: 445,
        comments: 67,
        views: 1800
      },
      timestamp: "8h ago",
      isLiked: false,
      isPremium: true
    },
    {
      id: "5",
      creator: {
        id: "2",
        name: "Alex Rivera",
        avatar: creator2,
        isVerified: true,
        category: "Music & Audio"
      },
      content: {
        text: "Throwback to my performance at the Lagos Music Festival! The energy was incredible. Thank you to everyone who came out! 🔥",
        image: creator2
      },
      engagement: {
        likes: 1234,
        comments: 203,
        views: 5600
      },
      timestamp: "1d ago",
      isLiked: true
    }
  ]

  const categories = [
    "All Categories",
    "Fashion & Style", 
    "Music & Audio",
    "Art & Design",
    "Photography",
    "Cooking & Food",
    "Technology",
    "Fitness & Health",
    "Business & Finance"
  ]

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.creator.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || selectedCategory === "All Categories" ||
                           post.creator.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.engagement.likes - a.engagement.likes
      case "newest":
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() // Placeholder, ideally use actual date objects
      case "trending":
        return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-modern">
      {/* Header Section */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              Explore Amazing <span className="bg-gradient-hero bg-clip-text text-transparent">Content</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover exclusive posts, videos, and art from talented creators worldwide.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts, creators, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category === "All Categories" ? "all" : category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Most Popular" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="random">Random</SelectItem> 
                </SelectContent>
              </Select>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Badge variant="secondary" className="cursor-pointer hover:bg-brand-primary hover:text-white transition-smooth">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending Posts
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-smooth">
                New Content
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-smooth">
                Premium Only
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-smooth">
                Videos
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pb-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-brand-primary" />
              Latest Posts
            </h2>
            <Badge variant="secondary" className="bg-brand-light/20 text-brand-primary border-brand-primary/20">
              {sortedPosts.length} posts found
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedPosts.map((post, index) => (
              <PostCard key={post.id} post={post} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }} />
            ))}
          </div>

          {/* Load More */}
          {sortedPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="hover:bg-brand-primary hover:text-white transition-smooth">
                Load More Posts
              </Button>
            </div>
          )}

          {/* No Results */}
          {sortedPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 rounded-full bg-gradient-secondary flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">No posts found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters to find more posts.
              </p>
              <Button onClick={() => {setSearchQuery(""); setSelectedCategory("all"); setSortBy("popular")}} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-secondary/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Share Your Creativity?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join TrueFans and start sharing your unique content, building a community, 
            and earning from your passion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-brand-primary hover:bg-brand-primary-light text-white">
              <a href="/signup">Become a Creator</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/features">Learn More</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Explore