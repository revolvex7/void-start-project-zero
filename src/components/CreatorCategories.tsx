const categories = [
  {
    title: "Podcasters",
    description: "From independent journalism to audio fiction",
    image: "🎙️",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Video Creators", 
    description: "YouTube channels, tutorials, and entertainment",
    image: "🎬",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Musicians",
    description: "Albums, singles, covers, and live performances", 
    image: "🎵",
    color: "from-green-500 to-teal-500"
  },
  {
    title: "Visual Artists",
    description: "Illustrations, comics, photography, and design",
    image: "🎨",
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Writers",
    description: "Novels, poetry, newsletters, and journalism",
    image: "✍️", 
    color: "from-indigo-500 to-purple-500"
  },
  {
    title: "Game Creators",
    description: "Indie games, streaming, and interactive content",
    image: "🎮",
    color: "from-pink-500 to-rose-500"
  }
];

const CreatorCategories = () => {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 patreon-text-shadow">
            For every type of creator
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Whatever you create, there's a place for it on [TrueFans]. Connect with your 
            audience and start earning a living from your creativity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className="group cursor-pointer animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="patreon-card rounded-2xl p-8 hover:bg-card/80 transition-all duration-500 patreon-hover-glow h-full">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {category.image}
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary-hover transition-colors">
                  {category.title}
                </h3>
                
                <p className="text-foreground/70 group-hover:text-foreground/90 transition-colors">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CreatorCategories;