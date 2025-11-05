import React, { useState } from 'react';
import '../styles/MovieCard.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ 
  movie, 
  isInWatchlist = false, 
  onToggleWatchlist,
  onUpdateRating,
  onUpdateStatus,
  onMovieClick,
  showControls = false 
}) {
  const [localRating, setLocalRating] = useState(movie.rating || 0);
  const [localStatus, setLocalStatus] = useState(movie.status || 'to_watch');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleCardClick = () => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  const handleHeartClick = (e) => {
    e.stopPropagation(); // Empêche l'ouverture du modal
    if (onToggleWatchlist) {
      onToggleWatchlist(movie);
    }
  };

  const handleStarClick = (rating) => {
    setLocalRating(rating);
    if (onUpdateRating) {
      onUpdateRating(movie.id, rating);
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setLocalStatus(newStatus);
    if (onUpdateStatus) {
      onUpdateStatus(movie.id, newStatus);
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'to_watch': return 'À voir';
      case 'watching': return 'En cours';
      case 'watched': return 'Vu';
      default: return 'À voir';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'to_watch': return '#fbbf24';
      case 'watching': return '#3b82f6';
      case 'watched': return '#10b981';
      default: return '#fbbf24';
    }
  };

  return (
    <div 
      className="movie-card" 
      onClick={handleCardClick} 
      style={{ cursor: onMovieClick ? 'pointer' : 'default' }}
    >
      {/* Poster */}
      <div className="movie-poster-container">
        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="movie-poster"
          />
        ) : (
          <div className="movie-no-poster">
            🎬
            <p>Pas d'affiche</p>
          </div>
        )}

        {/* Bouton Cœur */}
        <button 
          className={`movie-heart-btn ${isInWatchlist ? 'active' : ''}`}
          onClick={handleHeartClick}
          title={isInWatchlist ? "Retirer de la watchlist" : "Ajouter à la watchlist"}
        >
          {isInWatchlist ? '❤️' : '🤍'}
        </button>

        {/* Note moyenne TMDB */}
        {movie.vote_average && (
          <div className="movie-tmdb-rating">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>

      {/* Informations du film */}
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        
        <div className="movie-meta">
          <span className="movie-year">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </span>
        </div>

        {/* Contrôles (uniquement pour watchlist) */}
        {showControls && (
          <div className="movie-controls" onClick={(e) => e.stopPropagation()}>
            {/* Système d'étoiles */}
            <div className="movie-rating-section">
              <label className="movie-rating-label">Ma note :</label>
              <div className="movie-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star-btn ${star <= (hoveredStar || localRating) ? 'active' : ''}`}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Sélecteur de statut */}
            <div className="movie-status-section">
              <label className="movie-status-label">Statut :</label>
              <select 
                value={localStatus}
                onChange={handleStatusChange}
                className="movie-status-select"
                style={{ 
                  borderColor: getStatusColor(localStatus),
                  color: getStatusColor(localStatus)
                }}
              >
                <option value="to_watch">À voir</option>
                <option value="watching">En cours</option>
                <option value="watched">Vu</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}