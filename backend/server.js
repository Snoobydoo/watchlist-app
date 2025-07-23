const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/user", authRoutes);
app.use(cors());
app.use(express.json());

const movieRoutes = require("./routes/movieRoutes");
app.use("/movies", movieRoutes);

app.get("/", (req, res) => {
  res.send("API Watchlist opérationnelle");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connecté à MongoDB");
    app.listen(5000, () => console.log("Serveur sur http://localhost:5000"));
  })
  .catch((err) => console.error("Erreur MongoDB :", err));
