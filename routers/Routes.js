import express from "express";
import multer from "multer";
import { verifyUser } from "../middlewares/AuthUsers.js";
import {
  getMovies,
  getMoviesById,
  createMovies,
  updateMovies,
  deleteMovies,
  uploadMovie,
} from "../controllers/moviesControllers.js";
import {
  createUsers,
  deleteUser,
  getUsers,
  getUsersById,
  updateUsers,
} from "../controllers/usersControllers.js";
import { login, logout, me } from "../controllers/authControllers.js";
import diskStorage from "../uploads/uploads.js";
const router = express.Router();

//Router Welcome
router.get("/", function (req, res) {
  res.send("Selamat Datang Di Homework 10");
});

//router For Movie
router.get("/api/movies", verifyUser, getMovies); //Show all movies
router.get("/api/movies/:id", verifyUser, getMoviesById); //show movies with id
router.post("/api/movies", verifyUser, createMovies); //create a new movie
router.put("/api/movies/:id", verifyUser, updateMovies); //Update a movie with id
router.delete("/api/movies/:id", deleteMovies); //Delete a movie with id

//router for auth
router.get("/api/users/me", me); //check status account
router.post("/api/users/login", login); //login route
router.delete("/api/users/logout", logout); //Logout route

//router for user management

router.get("/api/users", verifyUser, getUsers); //get All Users Data
router.get("/api/users/:id", verifyUser, getUsersById); //get users by id
router.post("/api/users/register", createUsers); //Register User
router.put("/api/users/:id", verifyUser, updateUsers); //update existing user
router.delete("/api/users/:id", verifyUser, deleteUser); //delete existing user

//router for upload file
// POST endpoint for uploading movie images
const upload = multer({ storage: diskStorage });
router.post("/api/movies/upload/:id", upload.single("photo"), (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
    const imagePath = req.file.path;
    uploadMovie(req.body.movieId, imagePath);

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      imagePath: imagePath,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
