
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-theSplit-teal/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-theSplit-teal to-theSplit-aqua flex items-center justify-center">
                <span className="text-theSplit-white font-bold">S</span>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-theSplit-teal to-theSplit-aqua bg-clip-text text-transparent">
                The Split
              </h3>
            </div>
            <p className="text-theSplit-light/70 text-sm">
              The simplest way to track shared expenses and settle debts with friends, roommates, and partners.
            </p>
          </div>
          
          <div>
            <h4 className="text-theSplit-white font-medium mb-3">Product</h4>
            <ul className="space-y-2">
              {["Features", "Security", "Pricing", "How It Works"].map(item => (
                <li key={item}>
                  <a href="#" className="text-theSplit-light/70 hover:text-theSplit-aqua transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-theSplit-white font-medium mb-3">Company</h4>
            <ul className="space-y-2">
              {["About Us", "Careers", "Blog", "Press"].map(item => (
                <li key={item}>
                  <a href="#" className="text-theSplit-light/70 hover:text-theSplit-aqua transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-theSplit-white font-medium mb-3">Legal</h4>
            <ul className="space-y-2">
              {["Terms of Service", "Privacy Policy", "Cookie Policy", "GDPR"].map(item => (
                <li key={item}>
                  <a href="#" className="text-theSplit-light/70 hover:text-theSplit-aqua transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-theSplit-teal/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-theSplit-light/70 text-sm">
            © {new Date().getFullYear()} The Split. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {["Twitter", "LinkedIn", "Instagram", "Facebook"].map(item => (
              <a 
                key={item} 
                href="#" 
                className="text-theSplit-light/70 hover:text-theSplit-aqua transition-colors text-sm"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
