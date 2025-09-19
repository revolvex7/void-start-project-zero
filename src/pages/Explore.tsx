import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, TrendingUp, Star } from "lucide-react"
import CreatorCard from "@/components/CreatorCard"
import creator1 from "@/assets/creator-avatar-1.jpg"
import creator2 from "@/assets/creator-avatar-2.jpg"
import creator3 from "@/assets/creator-avatar-3.jpg"

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = [
    "All", "Music & Audio", "Fashion & Style", "Art & Design", "Fitness & Health", 
    "Food & Cooking", "Technology", "Education", "Comedy", "Lifestyle"
  ]

  // Extended creator data
  const creators = [
    {
      id: "1",
      name: "Amara Okafor",
      avatar: creator1,
      category: "Fashion & Style",
      subscribers: 2500,
      monthlyPrice: 2500,
      rating: 4.9,
      isVerified: true,
      bio: "Nigerian fashion designer sharing exclusive styling tips and behind-the-scenes content.",
      isTrending: true
    },
    {
      id: "2", 
      name: "Kemi Adeleke",
      avatar: creator2,
      category: "Music & Audio",
      subscribers: 1800,
      monthlyPrice: 3000,
      rating: 4.8,
      bio: "Afrobeats artist offering exclusive tracks, live sessions, and music creation insights.",
      isTrending: true
    },
    {
      id: "3",
      name: "David Okonkwo", 
      avatar: creator3,
      category: "Art & Design",
      subscribers: 950,
      monthlyPrice: 2000,
      rating: 4.7,
      bio: "Digital artist creating stunning Nigerian-inspired artwork and tutorials."
    },
    {
      id: "4",
      name: "Fatima Hassan",
      avatar: creator1,
      category: "Food & Cooking",
      subscribers: 3200,
      monthlyPrice: 1500,
      rating: 4.9,
      isVerified: true,
      bio: "Chef specializing in modern Nigerian cuisine with traditional twists."
    },
    {
      id: "5",
      name: "Chidi Nwosu",
      avatar: creator2,
      category: "Fitness & Health",
      subscribers: 1200,
      monthlyPrice: 3500,
      rating: 4.6,
      bio: "Personal trainer helping Nigerians achieve fitness goals with home workouts."
    },
    {
      id: "6",
      name: "Blessing Adebayo",
      avatar: creator3,
      category: "Education",
      subscribers: 4100,
      monthlyPrice: 2200,
      rating: 4.8,
      isVerified: true,
      bio: "Tech educator making programming accessible to young Nigerians.",
      isTrending: true
    }
  ]

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.bio.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || creator.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const trendingCreators = creators.filter(creator => creator.isTrending)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-secondary py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Explore Creators
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing Nigerian creators sharing exclusive content with their fans
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search creators, categories, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Trending Section */}
        {trendingCreators.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-5 w-5 text-brand-coral" />
              <h2 className="text-2xl font-bold text-foreground">Trending Now</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingCreators.slice(0, 3).map((creator) => (
                <div key={creator.id} className="relative">
                  <CreatorCard creator={creator} />
                  <Badge className="absolute top-2 left-2 bg-brand-coral text-white border-0">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">All Creators</h2>
            <Button variant="soft" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "soft"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Results */}
        <section>
          {filteredCreators.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="space-y-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">No creators found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters to find more creators
                  </p>
                  <Button variant="hero" onClick={() => { setSearchTerm(""); setSelectedCategory("All") }}>
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCreators.map((creator) => (
                  <CreatorCard key={creator.id} creator={creator} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Load More */}
        {filteredCreators.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="hero" size="lg">
              Load More Creators
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Explore