const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imdbID: { type: String, required: true },
  poster: { type: String },
  status: {
    type: String,
    enum: ["à voir", "en cours", "vu"],
    default: "à voir"
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema);
