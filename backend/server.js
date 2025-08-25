// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");

app.use("/user", authRoutes);
app.use("/movies", movieRoutes);

// Route test
app.get("/", (req, res) => {
  res.send("API Watchlist opérationnelle");
});

// Connexion à MongoDB et lancement serveur
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connecté à MongoDB");
    app.listen(5000, () => console.log("Serveur sur http://localhost:5000"));
  })
  .catch((err) => console.error("Erreur MongoDB :", err));
