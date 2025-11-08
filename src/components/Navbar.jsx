import React, { useState, useEffect } from 'react';
import { Menu, X, Accessibility, LogIn, LogOut, User } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Navbar = ({ onGetStartedClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Voice Assistant', href: '#voice' },
    { name: 'Accessibility', href: '#accessibility' },
    { name: 'Jobs', href: '#jobs' },
    { name: 'Integration', href: '#integration' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-effect shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Accessibility className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NEXUS
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <User className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {user?.displayName || user?.email?.split('@')[0]}
                  </span>
                </div>
                <button 
                  onClick={onGetStartedClick}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
                >
                  Dashboard
                </button>
                <button 
                  onClick={logout}
                  className="px-4 py-2 text-gray-700 hover:text-red-600 transition-colors flex items-center space-x-2"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full font-medium transition-all flex items-center space-x-2"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
                <button 
                  onClick={onGetStartedClick}
                  className="button-primary"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-up">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="mt-4 space-y-2">
                <LanguageSelector />
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-600">
                          {user?.displayName || user?.email?.split('@')[0]}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        onGetStartedClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="button-primary w-full"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        setShowAuthModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </button>
                    <button 
                      onClick={() => {
                        onGetStartedClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="button-primary w-full"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </nav>
  );
};

export default Navbar;
