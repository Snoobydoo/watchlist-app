const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const movieController = require("../controllers/movieController");



router.post("/add", authenticate, movieController.addMovie);
router.get("/", authenticate, movieController.getUserMovies);
router.put("/:id", authenticate, movieController.updateMovie);
router.delete("/:id", authenticate, movieController.deleteMovie);

module.exports = router;