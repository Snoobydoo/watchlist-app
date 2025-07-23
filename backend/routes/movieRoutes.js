const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const authenticate = require("../middleware/authMiddleware");

router.post("/add", authenticate, movieController.addMovie);
router.get("/", authenticate, movieController.getUserMovies);
router.put("/:id", authenticate, updateMovie);
router.delete("/:id", authenticate, movieController.deleteMovie);

module.exports = router;