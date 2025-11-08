import React from 'react';
import {
  Accessibility,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Heart,
  Globe,
} from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features' },
      { name: 'Voice Assistant', href: '#voice' },
      { name: 'Accessibility', href: '#accessibility' },
      { name: 'Job Matching', href: '#jobs' },
      { name: 'Integrations', href: '#integration' },
      { name: 'Pricing', href: '#pricing' },
    ],
    Company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Blog', href: '#blog' },
      { name: 'Press Kit', href: '#press' },
      { name: 'Partners', href: '#partners' },
    ],
    Resources: [
      { name: 'Documentation', href: '#docs' },
      { name: 'API Reference', href: '#api' },
      { name: 'Community', href: '#community' },
      { name: 'Support', href: '#support' },
      { name: 'Status', href: '#status' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'Accessibility', href: '#accessibility-policy' },
    ],
  };

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: '#github', name: 'GitHub' },
    { icon: <Twitter className="w-5 h-5" />, href: '#twitter', name: 'Twitter' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#linkedin', name: 'LinkedIn' },
    { icon: <Globe className="w-5 h-5" />, href: '#blog', name: 'Blog' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Accessibility className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">NEXUS</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering inclusive workplaces through AI-powered accessibility
              solutions. Making work accessible for everyone, everywhere.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:workforrhody7@gmail.com"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">workforrhody7@gmail.com</span>
              </a>
              <a
                href="tel:+911234567890"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 123 456 7890</span>
              </a>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Bangalore, India</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700 pt-12 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-gray-400 mb-6">
              Get the latest updates on accessibility features and inclusive workplace practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© 2025 NEXUS. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>for inclusive workplaces</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <div className="px-4 py-2 bg-gray-800 rounded-lg text-xs text-gray-400 flex items-center space-x-2">
              <Accessibility className="w-4 h-4 text-green-500" />
              <span>WCAG 2.1 AAA Compliant</span>
            </div>
            <div className="px-4 py-2 bg-gray-800 rounded-lg text-xs text-gray-400 flex items-center space-x-2">
              <Github className="w-4 h-4 text-purple-500" />
              <span>MIT Licensed</span>
            </div>
            <div className="px-4 py-2 bg-gray-800 rounded-lg text-xs text-gray-400 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>Carbon Neutral</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
