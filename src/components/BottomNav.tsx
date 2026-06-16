import { Home, Grid, Box, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const location = useLocation();

  const isHome = location.pathname === '/' && location.hash !== '#solutions';
  const isSolutions = location.hash === '#solutions';
  const isProducts = location.pathname.startsWith('/category') || location.pathname.startsWith('/product');
  const isContact = location.pathname === '/contact';

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`bottom-nav-item ${isHome ? 'active' : ''}`}>
        <Home size={20} />
        <span>Home</span>
      </Link>
      <Link to="/#solutions" className={`bottom-nav-item ${isSolutions ? 'active' : ''}`}>
        <Grid size={20} />
        <span>Solutions</span>
      </Link>
      <Link to="/category/urology" className={`bottom-nav-item ${isProducts ? 'active' : ''}`}>
        <Box size={20} />
        <span>Products</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
