// src/pages/Search.jsx
import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import '../styles/Search.css';

const API_KEY = 'd9c6ab9b273efa978d1536a70966bf65';
const API_BASE_URL = 'https://api.themoviedb.org/3';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPopularMovies();
    fetchWatchlistIds();
  }, []);

  const fetchPopularMovies = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=1`
      );
      const data = await response.json();
      setMovies(data.results || []);
    } catch (err) {
      setError('Erreur lors du chargement des films');
      console.error(err);
    } finally {
      setLoading(false);
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
      console.error('Erreur lors du chargement de la watchlist:', err);
    }
  };

  const searchMovies = async (query) => {
    if (!query.trim()) {
      fetchPopularMovies();
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${query}&page=1`
      );
      const data = await response.json();
      setMovies(data.results || []);
      
      if (data.results.length === 0) {
        setError('Aucun film trouvé');
      }
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchMovies(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMovies(searchQuery);
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

  const toggleWatchlist = async (movie) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Veuillez vous connecter pour ajouter des films à votre watchlist');
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
        }
      }
    } catch (err) {
      console.error('Erreur:', err);
      alert('Une erreur est survenue');
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1 className="search-title">
          <span className="title-gradient">Découvrez</span> votre prochain film
        </h1>
        <p className="search-subtitle">
          Recherchez parmi des milliers de films et ajoutez-les à votre watchlist
        </p>
      </div>

      <div className="search-bar-section">
        <div className="search-bar-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Rechercher un film... (ex: Inception, Avatar)"
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            🔍 Rechercher
          </button>
        </div>
      </div>

      {loading && (
        <div className="search-loading">
          <div className="spinner"></div>
          <p>Chargement des films...</p>
        </div>
      )}

      {error && !loading && (
        <div className="search-error">
          {error}
        </div>
      )}

      {!loading && movies.length > 0 && (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWatchlist={watchlistIds.has(movie.id)}
              onToggleWatchlist={toggleWatchlist}
              onMovieClick={handleMovieClick}
              showControls={false}
            />
          ))}
        </div>
      )}

      {!loading && movies.length === 0 && !error && (
        <div className="search-empty">
          <div className="empty-icon">🎥</div>
          <h2>Commencez votre recherche</h2>
          <p>Recherchez un film pour commencer</p>
        </div>
      )}

      {/* Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isInWatchlist={watchlistIds.has(selectedMovie.id)}
          onToggleWatchlist={toggleWatchlist}
        />
      )}
    </div>
  );
}