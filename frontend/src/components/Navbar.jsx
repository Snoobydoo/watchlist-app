import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]); // Se met à jour quand on change de page

  // Effet au scroll pour changer l'apparence
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>

      {/* Bouton hamburger pour mobile */}
      <button 
        className="navbar-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation"
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Menu de navigation */}
      <ul className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
        <li>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Accueil
          </Link>
        </li>
        <li>
          <Link 
            to="/watchlist"
            className={location.pathname === '/watchlist' ? 'active' : ''}
          >
            Ma Watchlist
          </Link>
        </li>
        <li>
          <Link 
            to="/search"
            className={location.pathname === '/search' ? 'active' : ''}
          >
            Films
          </Link>
        </li>

        {/* Affichage conditionnel selon l'état de connexion */}
        {user ? (
          <>
            <li>
              <span className="user-greeting">
                Bonjour, {user.username}
              </span>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="logout-btn"
              >
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link 
                to="/login"
                className={location.pathname === '/login' ? 'active' : ''}
              >
                Connexion
              </Link>
            </li>
            <li>
              <Link 
                to="/register"
                className={location.pathname === '/register' ? 'active' : ''}
              >
                Inscription
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;