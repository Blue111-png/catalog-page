import { Link, useLocation, useNavigate } from 'react-router-dom';
import './header.css';

export default function Header() {
  const { pathname } = useLocation();
  {/*if (pathname === '/login') return null;*/}
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <span className="header__logo-main">NK</span>
          <span className="header__logo-sub">Aroma</span>
        </Link>
        <nav className="header__nav">
          <Link to="/" className={pathname === '/' ? 'active' : ''}>Catalog</Link>
          {isLoggedIn && (
          <Link to="/add" className={pathname === '/add' ? 'active' : ''}>Add Product</Link>)}
          {isLoggedIn ? (
            <button className="header__logout" onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login" className={pathname === '/login' ? 'active' : ''}>Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}