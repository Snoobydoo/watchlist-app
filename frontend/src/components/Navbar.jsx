import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/">Accueil</Link>
        </li>
        <li>
          <Link to="/watchlist">Ma Watchlist</Link>
        </li>
        <li>
          <Link to="/login">Connexion</Link>
        </li>
        <li>
          <Link to="/register">Inscription</Link>
        </li>
        <li>
          <Link to="/search">Films</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
