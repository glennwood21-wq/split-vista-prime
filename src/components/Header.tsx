
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-theSplit-navy/80 backdrop-blur-md border-b border-theSplit-teal/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-theSplit-teal to-theSplit-aqua flex items-center justify-center">
            <span className="text-theSplit-white font-bold">S</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-theSplit-teal to-theSplit-aqua bg-clip-text text-transparent">
            The Split
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-theSplit-light hover:text-theSplit-aqua transition-colors">Home</Link>
          <Link to="/games" className="text-theSplit-light hover:text-theSplit-aqua transition-colors">Games</Link>
          <Link to="/dashboard" className="text-theSplit-light hover:text-theSplit-aqua transition-colors">Dashboard</Link>
          <Link to="/signin">
            <Button variant="outline" className="border-theSplit-teal text-theSplit-aqua hover:bg-theSplit-teal/10">Sign In</Button>
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-theSplit-light hover:text-theSplit-aqua"
          >
            <Menu />
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-theSplit-navy border-t border-theSplit-teal/20 py-4">
          <nav className="container mx-auto px-4 flex flex-col space-y-3">
            <Link 
              to="/" 
              className="px-4 py-2 text-theSplit-light hover:bg-theSplit-teal/10 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/games" 
              className="px-4 py-2 text-theSplit-light hover:bg-theSplit-teal/10 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Games
            </Link>
            <Link 
              to="/dashboard" 
              className="px-4 py-2 text-theSplit-light hover:bg-theSplit-teal/10 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/signin" 
              className="px-4 py-2 text-theSplit-light hover:bg-theSplit-teal/10 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
