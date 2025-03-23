
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Apply for Loan', path: '/apply' },
    { name: 'My Applications', path: '/profile' },
    { name: 'Payments', path: '/payments' }
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-shrink-0">
            <NavLink to="/" className="flex items-center">
              <span className="text-primary font-semibold text-xl tracking-tight">LoanFlex</span>
            </NavLink>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => 
                  `px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    isActive 
                      ? 'text-primary bg-accent' 
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out transform ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'} overflow-hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive 
                    ? 'text-primary bg-accent' 
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
