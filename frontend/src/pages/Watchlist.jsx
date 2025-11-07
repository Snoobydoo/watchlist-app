import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import '../styles/Watchlist.css';

export default function Watchlist() {
  const [movies, setMovies] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, to_watch, watching, watched

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Veuillez vous connecter pour voir votre watchlist');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/watchlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMovies(data);
        const ids = new Set(data.map(movie => movie.tmdb_id));
        setWatchlistIds(ids);
      } else {
        setError('Erreur lors du chargement de la watchlist');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger la watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie) => {
    // movie.id existe déjà (car vous l'avez passé dans MovieCard)
    const tmdbMovie = {
      id: movie.id,  // ✅ Utilisez movie.id au lieu de movie.tmdb_id
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average || 0
    };

    setSelectedMovie(tmdbMovie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMovie(null), 300);
  };

  const removeFromWatchlist = async (movie) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/watchlist/${movie.id}`, {  // ✅ movie.id au lieu de movie.tmdb_id
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Mettre à jour l'état local pour retirer le film de l'affichage
        setMovies(movies.filter(m => m.tmdb_id !== movie.id));  // ✅ Comparer avec movie.id
        const newIds = new Set(watchlistIds);
        newIds.delete(movie.id);  // ✅ movie.id
        setWatchlistIds(newIds);
      }
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const updateRating = async (tmdbId, rating) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/watchlist/${tmdbId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating })
      });

      if (response.ok) {
        setMovies(movies.map(movie =>
          movie.tmdb_id === tmdbId ? { ...movie, rating } : movie
        ));
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const updateStatus = async (tmdbId, status) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/watchlist/${tmdbId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setMovies(movies.map(movie =>
          movie.tmdb_id === tmdbId ? { ...movie, status } : movie
        ));
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const filteredMovies = movies.filter(movie => {
    if (filter === 'all') return true;
    return movie.status === filter;
  });

  const getFilterCount = (status) => {
    if (status === 'all') return movies.length;
    return movies.filter(m => m.status === status).length;
  };

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <h1 className="watchlist-title">
          Ma <span className="title-gradient">Watchlist</span>
        </h1>
        <p className="watchlist-subtitle">
          {movies.length === 0
            ? "Votre collection de films personnelle est vide"
            : `${movies.length} film${movies.length > 1 ? 's' : ''} dans votre collection`
          }
        </p>
      </div>

      {loading ? (
        <div className="watchlist-loading">
          <div className="spinner"></div>
          <p>Chargement de votre watchlist...</p>
        </div>
      ) : error ? (
        <div className="watchlist-error">
          <div className="error-icon">⚠️</div>
          <h2>{error}</h2>
        </div>
      ) : movies.length === 0 ? (
        <div className="watchlist-empty">
          <div className="empty-icon">🎬</div>
          <h2>Votre watchlist est vide</h2>
          <p>Ajoutez des films depuis la page de recherche en cliquant sur le cœur !</p>
        </div>
      ) : (
        <>
          {/* Filtres */}
          <div className="watchlist-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Tous ({getFilterCount('all')})
            </button>
            <button
              className={`filter-btn ${filter === 'to_watch' ? 'active' : ''}`}
              onClick={() => setFilter('to_watch')}
            >
              À voir ({getFilterCount('to_watch')})
            </button>
            <button
              className={`filter-btn ${filter === 'watching' ? 'active' : ''}`}
              onClick={() => setFilter('watching')}
            >
              En cours ({getFilterCount('watching')})
            </button>
            <button
              className={`filter-btn ${filter === 'watched' ? 'active' : ''}`}
              onClick={() => setFilter('watched')}
            >
              Vus ({getFilterCount('watched')})
            </button>
          </div>

          {/* Grille de films */}
          <div className="movies-grid">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.tmdb_id}
                movie={{
                  id: movie.tmdb_id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                  release_date: movie.release_date,
                  vote_average: movie.vote_average,
                  rating: movie.rating,
                  status: movie.status || 'to_watch'
                }}
                isInWatchlist={true}
                onToggleWatchlist={removeFromWatchlist}
                onUpdateRating={updateRating}
                onUpdateStatus={updateStatus}
                onMovieClick={handleMovieClick}
                showControls={true}
              />
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <div className="watchlist-empty">
              <div className="empty-icon">🔍</div>
              <h2>Aucun film dans cette catégorie</h2>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isInWatchlist={watchlistIds.has(selectedMovie.id)}
          onToggleWatchlist={async (movie) => {
            const isInWatchlist = watchlistIds.has(movie.id);

            if (isInWatchlist) {
              // Supprimer de la watchlist
              const movieToRemove = { id: movie.id };
              await removeFromWatchlist(movieToRemove);
            } else {
              // Ajouter à la watchlist
              const token = localStorage.getItem('token');
              if (!token) return;

              try {
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
                  // Recharger la liste des films
                  fetchWatchlist();
                }
              } catch (err) {
                console.error('Erreur:', err);
                alert('Erreur lors de l\'ajout');
              }
            }
          }}
        />
      )}
    </div>
  );
}