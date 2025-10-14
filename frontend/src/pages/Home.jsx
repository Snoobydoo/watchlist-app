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
  };}