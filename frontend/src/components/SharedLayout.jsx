import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function SharedLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check login session
  const checkSession = () => {
    const loggedInUserStr = localStorage.getItem("oit_logged_in_user");
    if (loggedInUserStr) {
      try {
        setUser(JSON.parse(loggedInUserStr));
      } catch (e) {
        console.error("Error parsing user session:", e);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkSession();
    // Re-check session on route change
    const handleStorageChange = () => checkSession();
    window.addEventListener('storage', handleStorageChange);
    
    // Simulate initial loader hide
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [location]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("oit_logged_in_user");
    localStorage.removeItem("oit_token");
    sessionStorage.removeItem("data_entry_access");
    sessionStorage.removeItem("search_data_access");
    setUser(null);
    navigate('/');
  };

  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/signup' || 
                     location.pathname.startsWith('/constituency-login') || 
                     location.pathname === '/aditya-kirana';

  if (isAuthPage) {
    return (
      <>
        {loading && (
          <div className="loader-wrapper" style={{ opacity: 1, display: 'flex' }}>
            <div className="loader"></div>
          </div>
        )}
        {children}
      </>
    );
  }

  return (
    <>
      {/* Loader */}
      {loading && (
        <div className="loader-wrapper" style={{ opacity: 1, display: 'flex' }}>
          <div className="loader"></div>
        </div>
      )}

      {/* Header */}
      <header className={scrolled ? 'scrolled' : ''}>
        <div className="container navbar">
          <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img 
              src="/assets/Logo2.png" 
              alt="OIT_Stack" 
              style={{ height: '45px', width: '45px', objectFit: 'cover', borderRadius: '50%', boxShadow: '0 0 10px rgba(0,191,255,0.5)' }} 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/45'; }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
              <span className="logo-text" style={{ lineHeight: 1, marginBottom: '2px' }}>OIT_Stack</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                OnYX Integrated Tech Stack
              </span>
            </div>
          </Link>

          <ul className={`nav-links ${menuActive ? 'active' : ''}`}>
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            </li>
            <li>
              <Link to="/services" className={location.pathname.startsWith('/services') ? 'active' : ''}>Services</Link>
            </li>
            <li>
              <Link to="/maharashtra" className={location.pathname.startsWith('/maharashtra') || location.pathname.startsWith('/division') || location.pathname.startsWith('/district') ? 'active' : ''}>Regional Analytics</Link>
            </li>
            <li>
              <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
            </li>
            {user && (user.isDataEntryAdmin || user.role === 'employee') && (
              <li>
                <Link to="/data-entry" className={location.pathname === '/data-entry' ? 'active' : ''}>Data Entry</Link>
              </li>
            )}
            {user && (user.isSearchDataAdmin || user.role === 'employee') && (
              <li>
                <Link to="/search-data" className={location.pathname === '/search-data' ? 'active' : ''}>Search Portal</Link>
              </li>
            )}
          </ul>

          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>
                  Welcome, <strong style={{ color: '#0062ff' }}>{user.name}</strong>
                </span>
                <a 
                  href="#" 
                  onClick={handleLogout} 
                  style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </a>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <i className="fa-solid fa-right-to-bracket" style={{ color: 'var(--text-main)', fontSize: '1.05rem' }}></i> Login
                </Link>
                <Link 
                  to="/signup" 
                  style={{ color: '#0062ff', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <i className="fa-solid fa-user-plus" style={{ color: '#0062ff', fontSize: '1.05rem' }}></i> Register
                </Link>
              </>
            )}
          </div>

          <div className="hamburger" onClick={() => setMenuActive(!menuActive)}>
            <i className={`fa-solid ${menuActive ? 'fa-times' : 'fa-bars'}`}></i>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ minHeight: 'calc(100vh - 120px)' }}>
        {children}
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-top">
            <div className="footer-about" style={{ textAlign: 'left' }}>
              <Link to="/" className="logo" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-cube logo-icon" style={{ color: 'var(--accent)' }}></i>
                <span className="logo-text" style={{ color: 'white' }}>OIT_STACK</span>
              </Link>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                OnYX Integrated Tech Stack providing cutting edge strategies for business and political entities globally.
              </p>
              <div className="social-links" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <a href="https://www.linkedin.com" className="social-link"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="https://www.instagram.com/oit_stack?igsh=MTJ6Z29pdWJ3N2g3eg==" className="social-link" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a>
              </div>
            </div>

            <div className="footer-contact" style={{ textAlign: 'left' }}>
              <h4 className="footer-title">Contact Us</h4>
              <ul className="footer-links" style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  <i className="fa-solid fa-location-dot" style={{ marginTop: '5px', color: 'var(--brand-light)' }}></i>
                  <span>Flat No.307, Goldcliff Society, Pune- 411015</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  <i className="fa-solid fa-phone" style={{ marginTop: '5px', color: 'var(--brand-light)' }}></i>
                  +91 8983461569
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  <i className="fa-solid fa-envelope" style={{ marginTop: '5px', color: 'var(--brand-light)' }}></i>
                  onkarholkar@oitstack.com
                </li>
              </ul>
            </div>

            <div className="footer-action" style={{ textAlign: 'left' }}>
              <h4 className="footer-title">Get Started</h4>
              <Link to="/contact" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block' }}>
                <i className="fa-solid fa-paper-plane"></i> Request Service
              </Link>
            </div>
          </div>
          <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} OIT_STACK - OnYX Integrated Tech Stack. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a href="https://wa.me/918983461569" className="whatsapp-float" target="_blank" rel="noreferrer" title="Chat with us on WhatsApp">
        <i className="fa-brands fa-whatsapp"></i>
      </a>
    </>
  );
}
