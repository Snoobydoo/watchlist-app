const Movie = require("../models/Movies");

exports.addMovie = async (req, res) => {
  const { title, imdbID, poster, status, rating } = req.body;

  try {
    const newMovie = new Movie({
      title,
      imdbID,
      poster,
      status,
      rating,
      user: req.user.id,
    });

    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout du film." });
  }
};

exports.getUserMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ user: req.user.id });
    res.status(200).json(movies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupératiion des films." });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.status(200).json({ message: "Film supprimé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du film." });
  }
};

exports.updateMovie = async (req, res) => {
  const { id } = req.params;
  const { status, rating } = req.body;

  try {
    const movie = await Movie.findOne({ _id: id, user: req.user.id });

    if (!movie) {
      return res.status(404).json({ message: "Film non trouvé." });
    }

    if (status) movie.status = status;
    if (rating !== undefined) movie.rating = rating;

    await movie.save();

    res.status(200).json({ message: "Film mis à jour avec succès.", movie });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du film.", error });
  }
};
