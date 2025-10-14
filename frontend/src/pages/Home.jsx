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
  };}