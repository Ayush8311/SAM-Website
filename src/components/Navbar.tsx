import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import './Navbar.css';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/' && location.hash !== '#solutions';
  const isSolutions = location.hash === '#solutions';
  const isProducts = location.pathname.startsWith('/category') || location.pathname.startsWith('/product');
  const isContact = location.pathname === '/contact';

  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <Link to="/" className="brand">
          {/*<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAKZCAYAAAAmpFkyAADdEklEQVR4nOz9eZxk2XXYd/7OfS8icqutV3RjBxobFxBcRFH7Ytqy..." alt="Logo" className="logo-image" />*/}
          <div className="brand-text">
            <span className="bold-text">SAM INNOVATIVE</span>
            <span className="light-text">SOLUTIONS LLP</span>
          </div>
        </Link>

        <div className="nav-links desktop-only">
          <Link to="/" className={`nav-link ${isHome ? 'active' : ''}`}>Home</Link>
          <Link to="/#solutions" className={`nav-link ${isSolutions ? 'active' : ''}`}>Solutions</Link>
          <Link to="/category/urology" className={`nav-link ${isProducts ? 'active' : ''}`}>Products</Link>
          {/*<Link to="/contact" className={`nav-link ${isContact ? 'active' : ''}`}>Contact</Link>*/}
        </div>

        <div className="nav-actions">
          <button className="icon-btn" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
            <Search size={20} />
          </button>
          <button className="icon-btn mobile-only" aria-label="Menu">
            <Menu size={24} />
          </button>
          <div className="desktop-only">
            {/*<Link to="/contact" className="btn btn-primary">Get Started</Link>*/}
          </div>
        </div>
      </div>
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;
