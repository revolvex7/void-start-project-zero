import { Twitter, Instagram, Youtube, Facebook } from 'lucide-react';

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Features", href: "/features/create-on-your-terms" },
    ]
  },
  forCreators: {
    title: "For creators",
    links: [
      { label: "Podcasters", href: "/creators/podcasts" },
      { label: "Video creators", href: "/creators/video" },
      { label: "Musicians", href: "/creators/music" },
      { label: "Artists", href: "/creators/visualartists" },
    ]
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Creator Hub", href: "#creator-hub" },
      { label: "Newsroom", href: "#newsroom" },
      { label: "Help Centre", href: "#help" },
      { label: "Partners & integrations", href: "#partners" },
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
      { label: "Accessibility", href: "#accessibility" }
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
            
            <div className="flex space-x-3">
              <SocialLink icon={<Twitter className="w-4 h-4" />} href="#twitter" label="Twitter" />
              <SocialLink icon={<Instagram className="w-4 h-4" />} href="#instagram" label="Instagram" />
              <SocialLink icon={<Youtube className="w-4 h-4" />} href="#youtube" label="YouTube" />
              <SocialLink icon={<Facebook className="w-4 h-4" />} href="#facebook" label="Facebook" />
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
            <div className="flex flex-wrap items-center gap-3">
              <select className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white text-sm hover:bg-white/20 transition-colors cursor-pointer">
                <option className="bg-black">🇳🇬 Nigeria</option>
                <option className="bg-black">🇺🇸 United States</option>
                <option className="bg-black">🇬🇧 United Kingdom</option>
              </select>
              
              <select className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white text-sm hover:bg-white/20 transition-colors cursor-pointer">
                <option className="bg-black">₦ NGN</option>
                <option className="bg-black">€ EUR</option>
                <option className="bg-black">£ GBP</option>
              </select>
            </div>

            {/* Right Side - Copyright */}
            <div className="flex items-center">
              <p className="text-white/60 text-sm">
                © {new Date().getFullYear()} True Fans. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const SocialLink = ({ icon, href, label }: SocialLinkProps) => {
  return (
    <a 
      href={href}
      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 group"
      aria-label={label}
    >
      <span className="text-white/70 group-hover:text-white transition-colors">
        {icon}
      </span>
    </a>
  );
};

export default Footer;