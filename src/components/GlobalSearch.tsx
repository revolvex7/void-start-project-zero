import * as React from "react"
import { CommandDialog, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Search, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"

// Sample creator data (replace with actual API call)
const allCreators = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/src/assets/creator-avatar-1.jpg",
    category: "Fashion & Style",
    bio: "Fashion designer sharing exclusive styling tips and behind-the-scenes content."
  },
  {
    id: "2",
    name: "Alex Rivera",
    avatar: "/src/assets/creator-avatar-2.jpg",
    category: "Music & Audio",
    bio: "Independent artist offering exclusive tracks, live sessions, and music creation insights."
  },
  {
    id: "3",
    name: "Maya Chen",
    avatar: "/src/assets/creator-avatar-3.jpg",
    category: "Art & Design",
    bio: "Digital artist creating tutorials, process videos, and exclusive artwork for supporters."
  },
  {
    id: "4",
    name: "James Thompson",
    avatar: "/src/assets/creator-avatar-1.jpg",
    category: "Technology",
    bio: "Tech educator sharing coding tutorials, industry insights, and career guidance."
  },
  {
    id: "5",
    name: "Lisa Rodriguez",
    avatar: "/src/assets/creator-avatar-2.jpg",
    category: "Fitness & Health",
    bio: "Certified fitness trainer offering personalized workout plans and nutrition advice."
  },
]

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const filteredCreators = searchQuery.length > 0
    ? allCreators.filter(creator =>
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.bio.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <>
      <Button
        variant="outline"
        className="sm:w-64 justify-start text-sm text-muted-foreground rounded-full pr-2 pl-4"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        Find a Creator...
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search creators, categories, tags..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            {searchQuery.length > 0 ? "No results found." : "Start typing to search..."}
          </CommandEmpty>
          
          {searchQuery.length === 0 && (
            <CommandGroup heading="Recent Searches">
              {/* Placeholder for recent searches */}
              <CommandItem className="aria-selected:bg-muted text-muted-foreground cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                <span>Fashion & Style</span>
              </CommandItem>
              <CommandItem className="aria-selected:bg-muted text-muted-foreground cursor-pointer">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Popular Music</span>
              </CommandItem>
            </CommandGroup>
          )}

          {filteredCreators.length > 0 && (
            <CommandGroup heading="Creators">
              {filteredCreators.map(creator => (
                <CommandItem key={creator.id} onSelect={() => {
                  setOpen(false);
                  setSearchQuery("");
                  // Navigate to creator profile
                  window.location.href = `/creator/${creator.id}`;
                }} className="cursor-pointer">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{creator.name}</p>
                    <p className="text-sm text-muted-foreground">{creator.category}</p>
                  </div>
                </CommandItem>
              ))}
              <CommandItem onSelect={() => {
                setOpen(false);
                setSearchQuery("");
                window.location.href = "/creators";
              }} className="cursor-pointer text-brand-primary font-medium justify-center">
                See all results
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
} 