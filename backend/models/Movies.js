const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    tmdb_id: { type: Number, required: true },  // ← ID de TMDB (au lieu de imdbID)
    title: { type: String, required: true },
    poster_path: { type: String },              // ← Chemin du poster TMDB (optionnel)
    release_date: { type: String },             // ← Date de sortie complète
    vote_average: { type: Number },             // ← Note moyenne TMDB
    status: {
      type: String,
      enum: ["to_watch", "watching", "watched"], // ← En anglais pour cohérence
      default: "to_watch",
    },
    rating: {
      type: Number,
      min: 0,                                    // ← Commence à 0 (pas de note)
      max: 5,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Index pour éviter les doublons (un utilisateur ne peut pas ajouter 2 fois le même film)
movieSchema.index({ tmdb_id: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Movie", movieSchema);