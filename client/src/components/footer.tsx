import { Link } from "wouter";
import { 
  MapPin, Mail, 
  Twitter, MessageCircle, Linkedin, FileText, 
  Github 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-display text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 mb-4">
              AURA FORGE
            </div>
            <p className="text-muted-foreground mb-4">
              A Data-Driven, Scalable Framework for Web3 Game Studios to Acquire, Engage, and Monetize Players Efficiently
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">
                <Github size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-foreground transition">Home</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">The Game</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Partnerships</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Events & Rewards</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Case Studies</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Guides</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <a href="mailto:info@auraforge.io" className="text-muted-foreground hover:text-foreground transition">
                  info@auraforge.io
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Global (Remote-First)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">© 2023 AURA FORGE. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition text-sm">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition text-sm">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
