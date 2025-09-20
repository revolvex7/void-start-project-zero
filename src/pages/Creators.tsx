import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, TrendingUp } from "lucide-react"
import CreatorCard from "@/components/CreatorCard"
import creator1 from "@/assets/creator-avatar-1.jpg"
import creator2 from "@/assets/creator-avatar-2.jpg"
import creator3 from "@/assets/creator-avatar-3.jpg"
import creatorStudio from "@/assets/creator-studio.jpg"
import creatorPodcast from "@/assets/creator-podcast.jpg"
import creatorArtist from "@/assets/creator-artist.jpg"

const Creators = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  // Sample creator data - in real app this would come from API
  const allCreators = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: creator1,
      category: "Fashion & Style",
      subscribers: 2500,
      monthlyPrice: 15,
      rating: 4.9,
      isVerified: true,
      coverImage: creatorStudio,
      bio: "Fashion designer sharing exclusive styling tips and behind-the-scenes content."
    },
    {
      id: "2", 
      name: "Alex Rivera",
      avatar: creator2,
      category: "Music & Audio",
      subscribers: 1800,
      monthlyPrice: 20,
      rating: 4.8,
      isVerified: true,
      coverImage: creatorPodcast,
      bio: "Independent artist offering exclusive tracks, live sessions, and music creation insights."
    },
    {
      id: "3",
      name: "Maya Chen",
      avatar: creator3,
      category: "Art & Design",
      subscribers: 3200,
      monthlyPrice: 12,
      rating: 4.9,
      isVerified: true,
      coverImage: creatorArtist,
      bio: "Digital artist creating tutorials, process videos, and exclusive artwork for supporters."
    },
    {
      id: "4",
      name: "James Thompson",
      avatar: creator1,
      category: "Technology",
      subscribers: 4500,
      monthlyPrice: 25,
      rating: 4.7,
      isVerified: true,
      bio: "Tech educator sharing coding tutorials, industry insights, and career guidance."
    },
    {
      id: "5",
      name: "Lisa Rodriguez",
      avatar: creator2,
      category: "Fitness & Health",
      subscribers: 1200,
      monthlyPrice: 18,
      rating: 4.8,
      bio: "Certified fitness trainer offering personalized workout plans and nutrition advice."
    },
    {
      id: "6",
      name: "David Kim",
      avatar: creator3,
      category: "Photography",
      subscribers: 2800,
      monthlyPrice: 22,
      rating: 4.9,
      isVerified: true,
      bio: "Professional photographer sharing techniques, behind-the-scenes content, and exclusive shots."
    },
    {
      id: "7",
      name: "Emma Watson",
      avatar: creator1,
      category: "Cooking & Food",
      subscribers: 3600,
      monthlyPrice: 16,
      rating: 4.6,
      bio: "Chef and food blogger creating exclusive recipes and cooking masterclasses."
    },
    {
      id: "8",
      name: "Michael Brown",
      avatar: creator2,
      category: "Business & Finance",
      subscribers: 5200,
      monthlyPrice: 35,
      rating: 4.8,
      isVerified: true,
      bio: "Entrepreneur and investor sharing business strategies and market insights."
    }
  ]

  const categories = [
    "All Categories",
    "Fashion & Style", 
    "Music & Audio",
    "Art & Design",
    "Technology",
    "Fitness & Health",
    "Photography",
    "Cooking & Food",
    "Business & Finance"
  ]

  // Filter creators based on search and category
  const filteredCreators = allCreators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.bio.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || selectedCategory === "All Categories" ||
                           creator.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort creators
  const sortedCreators = [...filteredCreators].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.subscribers - a.subscribers
      case "newest":
        return Math.random() - 0.5 // Random for demo
      case "price-low":
        return a.monthlyPrice - b.monthlyPrice
      case "price-high":
        return b.monthlyPrice - a.monthlyPrice
      case "rating":
        return b.rating - a.rating
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
              Discover Amazing <span className="bg-gradient-hero bg-clip-text text-transparent">Creators</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Support your favorite creators and discover exclusive content from 
              talented individuals around the world.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search creators, categories, or tags..."
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
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Badge variant="secondary" className="cursor-pointer hover:bg-brand-primary hover:text-white transition-smooth">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-smooth">
                New Creators
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-smooth">
                Verified
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-smooth">
                Most Affordable
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators Section */}
      <section className="pb-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-brand-primary" />
              Featured Creators
            </h2>
            <Badge variant="secondary" className="bg-brand-light/20 text-brand-primary border-brand-primary/20">
              {sortedCreators.length} creators found
            </Badge>
          </div>

          {/* Creators Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>

          {/* Load More */}
          {sortedCreators.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="hover:bg-brand-primary hover:text-white transition-smooth">
                Load More Creators
              </Button>
            </div>
          )}

          {/* No Results */}
          {sortedCreators.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 rounded-full bg-gradient-secondary flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">No creators found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters to find more creators.
              </p>
              <Button onClick={() => {setSearchQuery(""); setSelectedCategory("all")}} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-secondary/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Are You a Creator?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join TrueFans and start building your community, sharing your passion, 
            and earning from your creative work.
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

export default Creators