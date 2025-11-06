const Movie = require("../models/Movies");

exports.addMovie = async (req, res) => {
  const { tmdb_id, title, poster_path, release_date, vote_average, status, rating } = req.body;

  try {
    // Vérifier si le film existe déjà pour cet utilisateur
    const existingMovie = await Movie.findOne({ tmdb_id, user: req.user.id });
    if (existingMovie) {
      return res.status(400).json({ message: "Ce film est déjà dans votre watchlist." });
    }

    const newMovie = new Movie({
      tmdb_id,
      title,
      poster_path,
      release_date,
      vote_average,
      status: status || 'to_watch',
      rating: rating || null,
      user: req.user.id,
    });

    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    console.error("Erreur addMovie:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du film." });
  }
};

exports.getUserMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(movies);
  } catch (error) {
    console.error("Erreur getUserMovies:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des films." });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    // req.params.id correspond au tmdb_id envoyé depuis le frontend
    const movie = await Movie.findOneAndDelete({ 
      tmdb_id: req.params.id, 
      user: req.user.id 
    });
    
    if (!movie) {
      return res.status(404).json({ message: "Film non trouvé." });
    }
    
    res.status(200).json({ message: "Film supprimé avec succès." });
  } catch (error) {
    console.error("Erreur deleteMovie:", error);
    res.status(500).json({ message: "Erreur lors de la suppression du film." });
  }
};

exports.updateMovie = async (req, res) => {
  const { id } = req.params; // C'est le tmdb_id
  const { status, rating } = req.body;

  try {
    const movie = await Movie.findOne({ tmdb_id: id, user: req.user.id });

    if (!movie) {
      return res.status(404).json({ message: "Film non trouvé." });
    }

    if (status) movie.status = status;
    if (rating !== undefined) movie.rating = rating;

    await movie.save();

    res.status(200).json({ message: "Film mis à jour avec succès.", movie });
  } catch (error) {
    console.error("Erreur updateMovie:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du film.", error });
  }
};