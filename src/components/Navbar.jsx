import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/nirvana-logo.jpeg';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileOpen(false);
  }, [location.pathname]);

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Live Monitor', path: '/monitor' },
    { label: 'About', path: '/about' },
    { label: 'Features', path: '/features' },
    { label: 'Sensors', path: '/sensors' },
    { label: 'AI Analysis', path: '/ai-analysis' },
    { label: 'Reports', path: '/reports' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <img src={logoImg} alt="NIRVANA Logo" className="navbar__logo-img" style={{ height: '36px' }} />
          </Link>

          <div className="navbar__links">
            {links.map(l => (
              <NavLink 
                key={l.path} 
                to={l.path} 
                className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}
                end={l.path === '/'}
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <Link to="/monitor" className="navbar__cta navbar__cta-desktop">
            View Live Monitoring
          </Link>

          <button
            className={`navbar__hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className={`navbar__mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {links.map(l => (
          <NavLink 
            key={l.path} 
            to={l.path} 
            className={({ isActive }) => `navbar__mobile-link ${isActive ? 'active' : ''}`}
            end={l.path === '/'}
          >
            {l.label}
          </NavLink>
        ))}
        <Link to="/monitor" className="btn btn--primary btn--sm" style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
          View Live Monitoring
        </Link>
      </div>
    </>
  );
}
