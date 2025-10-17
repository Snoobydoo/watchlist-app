// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import '../styles/Home.css';

const API_KEY = 'd9c6ab9b273efa978d1536a70966bf65';
const API_BASE_URL = 'https://api.themoviedb.org/3';

export default function Home() {
  const navigate = useNavigate();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchTrending(),
      fetchUpcoming(),
      fetchTopRated(),
      fetchWatchlistIds(),
      fetchUserStats()
    ]);
    setLoading(false);
  };

  const fetchTrending = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=fr-FR`
      );
      const data = await response.json();
      setTrendingMovies(data.results?.slice(0, 10) || []);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const fetchUpcoming = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=fr-FR&page=1`
      );
      const data = await response.json();
      setUpcomingMovies(data.results?.slice(0, 10) || []);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const fetchTopRated = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=fr-FR&page=1`
      );
      const data = await response.json();
      setTopRatedMovies(data.results?.slice(0, 10) || []);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const fetchWatchlistIds = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/watchlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const ids = new Set(data.map(movie => movie.tmdb_id));
        setWatchlistIds(ids);
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/watchlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const stats = {
          total: data.length,
          toWatch: data.filter(m => m.status === 'to_watch').length,
          watching: data.filter(m => m.status === 'watching').length,
          watched: data.filter(m => m.status === 'watched').length
        };
        setUserStats(stats);
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const toggleWatchlist = async (movie) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Veuillez vous connecter pour ajouter des films à votre watchlist');
      navigate('/login');
      return;
    }

    const isInWatchlist = watchlistIds.has(movie.id);

    try {
      if (isInWatchlist) {
        const response = await fetch(`http://localhost:5000/api/watchlist/${movie.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const newIds = new Set(watchlistIds);
          newIds.delete(movie.id);
          setWatchlistIds(newIds);
          fetchUserStats();
        }
      } else {
        const response = await fetch('http://localhost:5000/api/watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            tmdb_id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average
          })
        });

        if (response.ok) {
          const newIds = new Set(watchlistIds);
          newIds.add(movie.id);
          setWatchlistIds(newIds);
          fetchUserStats();
        }
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMovie(null), 300);
  };

  const MovieCarousel = ({ title, movies, icon }) => (
    <div className="carousel-section">
      <div className="carousel-header">
        <h2 className="carousel-title">
          <span className="carousel-icon">{icon}</span>
          {title}
        </h2>
        <button className="carousel-see-all" onClick={() => navigate('/search')}>
          Voir tout →
        </button>
      </div>
      <div className="carousel-container">
        <div className="carousel-scroll">
          {movies.map((movie) => (
            <div key={movie.id} className="carousel-item">
              <MovieCard
                movie={movie}
                isInWatchlist={watchlistIds.has(movie.id)}
                onToggleWatchlist={toggleWatchlist}
                onMovieClick={handleMovieClick}
                showControls={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="home-loading">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Votre collection de films
            <span className="hero-gradient"> personnelle</span>
          </h1>
          <p className="hero-subtitle">
            Découvrez, sauvegardez et suivez tous les films que vous souhaitez regarder
          </p>
          <div className="hero-buttons">
            <button className="hero-btn primary" onClick={() => navigate('/search')}>
              🔍 Découvrir des films
            </button>
            <button className="hero-btn secondary" onClick={() => navigate('/watchlist')}>
              ❤️ Ma watchlist
            </button>
          </div>

          {/* Stats utilisateur */}
          {userStats && userStats.total > 0 && (
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{userStats.total}</span>
                <span className="stat-label">Films</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">{userStats.watched}</span>
                <span className="stat-label">Vus</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">{userStats.toWatch}</span>
                <span className="stat-label">À voir</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="how-it-works">
        <h2 className="section-title">Comment ça marche ?</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">🔍</div>
            <h3 className="step-title">1. Recherchez</h3>
            <p className="step-description">
              Parcourez des milliers de films et découvrez vos prochains favoris
            </p>
          </div>
          <div className="step-card">
            <div className="step-icon">❤️</div>
            <h3 className="step-title">2. Ajoutez</h3>
            <p className="step-description">
              Créez votre watchlist personnalisée en un clic
            </p>
          </div>
          <div className="step-card">
            <div className="step-icon">⭐</div>
            <h3 className="step-title">3. Suivez</h3>
            <p className="step-description">
              Notez vos films et suivez votre progression
            </p>
          </div>
        </div>
      </section>

      {/* Tendances */}
      <MovieCarousel 
        title="Tendances de la semaine" 
        movies={trendingMovies}
        icon="🔥"
      />

      {/* Prochaines sorties */}
      <MovieCarousel 
        title="Prochainement au cinéma" 
        movies={upcomingMovies}
        icon="🎬"
      />

      {/* Mieux notés */}
      <MovieCarousel 
        title="Les mieux notés" 
        movies={topRatedMovies}
        icon="⭐"
      />
    </div>
  );
}