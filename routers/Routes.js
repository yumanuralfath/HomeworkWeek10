import express from "express";
import { verifyUser } from "../middlewares/AuthUsers.js";
import {
  getMovies,
  getMoviesById,
  createMovies,
  updateMovies,
  deleteMovies,
} from "../controllers/moviesControllers.js";
import {
  createUsers,
  deleteUser,
  getUsers,
  getUsersById,
  updateUsers,
} from "../controllers/usersControllers.js";
import { login, logout, me } from "../controllers/authControllers.js";
const router = express.Router();

//Router Welcome
router.get("/", function (req, res) {
  res.send("Selamat Datang Di Homework 10");
});

//router For Movie
router.get("/api/movies", verifyUser,  getMovies); //Show all movies
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


export default router;
