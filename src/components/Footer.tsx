const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "Pricing", href: "#pricing" },
      { label: "Features", href: "#features" },
      { label: "Mobile app", href: "#mobile" },
      { label: "[TrueFans] logo", href: "#logo" }
    ]
  },
  forCreators: {
    title: "For creators",
    links: [
      { label: "Podcasters", href: "#podcasters" },
      { label: "Video creators", href: "#video" },
      { label: "Musicians", href: "#musicians" },
      { label: "Visual artists", href: "#artists" },
      { label: "Writers & journalists", href: "#writers" },
      { label: "Communities", href: "#communities" },
      { label: "Gaming creators", href: "#gaming" }
    ]
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Blog", href: "#blog" },
      { label: "[TrueFans] U", href: "#university" },
      { label: "Help center & FAQ", href: "#help" },
      { label: "App directory", href: "#apps" },
      { label: "Developers", href: "#developers" }
    ]
  },
  company: {
    title: "Company", 
    links: [
      { label: "About", href: "#about" },
      { label: "Press", href: "#press" },
      { label: "Careers", href: "#careers" },
      { label: "Privacy", href: "#privacy" },
      { label: "Policy & Terms", href: "#terms" },
      { label: "Accessibility", href: "#accessibility" },
      { label: "Impressum", href: "#impressum" }
    ]
  }
};

const Footer = () => {
  return (
    <footer className="bg-black/95 backdrop-blur-sm py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground tracking-wider">
                [TrueFans]
              </h3>
            </div>
            
            <p className="text-foreground/70 mb-6">
              True Fans powers creative independence. We're building a future where creators are valued and fans directly support the work they love.
            </p>
            
            <div className="flex space-x-4">
              <SocialLink icon="twitter" href="#twitter" />
              <SocialLink icon="instagram" href="#instagram" />
              <SocialLink icon="youtube" href="#youtube" />
              <SocialLink icon="facebook" href="#facebook" />
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="text-foreground font-semibold mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="text-foreground/70 hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
                 

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            {/* Left Side - Language and Currency */}
            <div className="flex items-center space-x-4">
              <select className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white text-sm">
                <option className="bg-black">English (United...)</option>
                <option className="bg-black">Français</option>
                <option className="bg-black">Deutsch</option>
                <option className="bg-black">Español</option>
              </select>
              
              <select className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white text-sm">
                <option className="bg-black">🇵🇰 Pakistan (پاکستان)</option>
                <option className="bg-black">🇺🇸 United States</option>
                <option className="bg-black">🇬🇧 United Kingdom</option>
              </select>
              
              <select className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white text-sm">
                <option className="bg-black">💲 USD</option>
                <option className="bg-black">€ EUR</option>
                <option className="bg-black">£ GBP</option>
              </select>
            </div>

            {/* Right Side - Social Icons and Address */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="flex items-center space-x-4">
                <SocialLink icon="𝕏" href="#twitter" />
                <SocialLink icon="f" href="#facebook" />
                <SocialLink icon="📷" href="#instagram" />
                <SocialLink icon="▶" href="#youtube" />
                <SocialLink icon="in" href="#linkedin" />
              </div>
              
              <p className="text-white/60 text-sm">
                600 Townsend Street, Suite 500 | San Francisco, CA 94103, USA | © True Fans
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  icon: string;
  href: string;
}

const SocialLink = ({ icon, href }: SocialLinkProps) => {
  return (
    <a 
      href={href}
      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
    >
      <span className="text-white/70 hover:text-white transition-colors text-sm font-semibold">
        {icon}
      </span>
    </a>
  );
};

export default Footer;