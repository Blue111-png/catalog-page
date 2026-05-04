import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <span className="header__logo-main">NK</span>
          <span className="header__logo-sub">Aroma</span>
        </Link>
        <nav className="header__nav">
          <Link to="/" className={pathname === '/' ? 'active' : ''}>Catalog</Link>
          <Link to="/add" className={pathname === '/add' ? 'active' : ''}>Add Product</Link>
        </nav>
      </div>
    </header>
  );
}