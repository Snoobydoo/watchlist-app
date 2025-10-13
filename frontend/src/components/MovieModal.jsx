import React, { useState, useEffect } from 'react';
import '../styles/MovieModal.css';

const API_KEY = 'd9c6ab9b273efa978d1536a70966bf65';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

export default function MovieModal({ movie, isOpen, onClose, isInWatchlist, onToggleWatchlist }) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && movie) {
      fetchMovieDetails();
    }
  }, [isOpen, movie]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits,videos`
      );
      const data = await response.json();
      setMovieDetails(data);
    } catch (err) {
      console.error('Erreur lors du chargement des détails:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const formatMoney = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {loading ? (
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Chargement des détails...</p>
          </div>
        ) : movieDetails ? (
          <>
            {/* Backdrop */}
            {movieDetails.backdrop_path && (
              <div className="modal-backdrop">
                <img
                  src={`${BACKDROP_BASE_URL}${movieDetails.backdrop_path}`}
                  alt={movieDetails.title}
                />
                <div className="modal-backdrop-overlay"></div>
              </div>
            )}

            {/* Contenu principal */}
            <div className="modal-body">
              <div className="modal-header-section">
                {/* Poster */}
                <div className="modal-poster">
                  {movieDetails.poster_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}${movieDetails.poster_path}`}
                      alt={movieDetails.title}
                    />
                  ) : (
                    <div className="modal-no-poster">🎬</div>
                  )}
                </div>

                {/* Informations principales */}
                <div className="modal-info">
                  <h2 className="modal-title">{movieDetails.title}</h2>
                  
                  {movieDetails.tagline && (
                    <p className="modal-tagline">"{movieDetails.tagline}"</p>
                  )}

                  <div className="modal-meta">
                    <span className="meta-item">
                      📅 {movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : 'N/A'}
                    </span>
                    <span className="meta-item">
                      ⏱️ {formatRuntime(movieDetails.runtime)}
                    </span>
                    <span className="meta-item rating">
                      ⭐ {movieDetails.vote_average.toFixed(1)}/10
                    </span>
                  </div>

                  {/* Genres */}
                  {movieDetails.genres && movieDetails.genres.length > 0 && (
                    <div className="modal-genres">
                      {movieDetails.genres.map((genre) => (
                        <span key={genre.id} className="genre-tag">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bouton Watchlist */}
                  <button
                    className={`modal-watchlist-btn ${isInWatchlist ? 'active' : ''}`}
                    onClick={() => onToggleWatchlist(movie)}
                  >
                    {isInWatchlist ? '❤️ Dans ma watchlist' : '🤍 Ajouter à ma watchlist'}
                  </button>
                </div>
              </div>

              {/* Synopsis */}
              {movieDetails.overview && (
                <div className="modal-section">
                  <h3 className="section-title">Synopsis</h3>
                  <p className="modal-overview">{movieDetails.overview}</p>
                </div>
              )}

              {/* Casting */}
              {movieDetails.credits && movieDetails.credits.cast && movieDetails.credits.cast.length > 0 && (
                <div className="modal-section">
                  <h3 className="section-title">Casting principal</h3>
                  <div className="cast-grid">
                    {movieDetails.credits.cast.slice(0, 6).map((actor) => (
                      <div key={actor.id} className="cast-card">
                        {actor.profile_path ? (
                          <img
                            src={`${IMAGE_BASE_URL}${actor.profile_path}`}
                            alt={actor.name}
                            className="cast-photo"
                          />
                        ) : (
                          <div className="cast-no-photo">👤</div>
                        )}
                        <div className="cast-info">
                          <p className="cast-name">{actor.name}</p>
                          <p className="cast-character">{actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Informations supplémentaires */}
              <div className="modal-section">
                <h3 className="section-title">Informations</h3>
                <div className="info-grid">
                  {movieDetails.budget > 0 && (
                    <div className="info-item">
                      <span className="info-label">Budget</span>
                      <span className="info-value">{formatMoney(movieDetails.budget)}</span>
                    </div>
                  )}
                  {movieDetails.revenue > 0 && (
                    <div className="info-item">
                      <span className="info-label">Recettes</span>
                      <span className="info-value">{formatMoney(movieDetails.revenue)}</span>
                    </div>
                  )}
                  {movieDetails.original_language && (
                    <div className="info-item">
                      <span className="info-label">Langue originale</span>
                      <span className="info-value">{movieDetails.original_language.toUpperCase()}</span>
                    </div>
                  )}
                  {movieDetails.production_companies && movieDetails.production_companies.length > 0 && (
                    <div className="info-item full-width">
                      <span className="info-label">Production</span>
                      <span className="info-value">
                        {movieDetails.production_companies.map(c => c.name).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="modal-error">
            <p>Impossible de charger les détails du film</p>
          </div>
        )}
      </div>
    </div>
  );
}