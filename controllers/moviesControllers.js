import movies from "../models/movies.js";
import pagination from "./pagination.js";

//get all movies
export const getMovies = async (req, res, next) => {
  try {
    const response = await movies.findAll();
    const page = parseInt(req.query.page) || 1; //parse page by query or default to 1
    const limit = parseInt(req.query.limit) || 10; //parse limit default 10
    const paginatedResults = pagination(page, limit, response);
    res.status(200).json(paginatedResults);
  } catch (error) {
    next(error);
  }
};

//Get movies from the database by Id
export const getMoviesById = async (req, res) => {
  try {
    let whereCondition;
    if (
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        req.params.id
      )
    ) {
      whereCondition = { id: req.params.id };
    } else if (!isNaN(req.params.id)) {
      whereCondition = { id: req.params.id };
    } else {
      return res.status(400).json({ msg: "Invalid ID format" });
    }

    const movie = await movies.findOne({
      where: whereCondition,
    });

    if (!movie) {
      return res.status(404).json({ msg: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

//Create a new movie
export const createMovies = async (req, res, next) => {
  try {
    const { id, title, genres, year } = req.body;
    const movie = await movies.create({
      id,
      title,
      genres,
      year,
    });
    res.status(201).json({ msg: "Movie created successfully" });
  } catch (error) {
    next(error);
  }
};

//update movie by Id
export const updateMovies = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, genres, year } = req.body;

    //Check availability Id
    const existingMovies = await movies.findByPk(id);
    if (!existingMovies) {
      res.status(404).json({ error: "Movies not found" });
    }
    await existingMovies.update({
      title: title || existingMovies.title,
      genres: genres || existingMovies.genres,
      year: year || existingMovies.year,
    });

    //send response to client movie get update
    res.status(200).json({ msg: "Movie updated successfully" });
  } catch (error) {
    next(error);
  }
};

//Delete a movie by Id(
export const deleteMovies = async (req, res, next) => {
  try {
    const { id } = req.params;

    //Check if id exists
    const existingMovies = await movies.findByPk(id);
    if (!existingMovies) {
      return res.status(404).json({ error: "Movie not found" });
    }

    await existingMovies.destroy();
    res.status(200).json({ msg: "Movie deleted successfully" });
  } catch (error) {
    next(error);
  }
};

//upload movies photo
export const uploadMovie = async (req, res, next) => {
  try {
    let whereCondition;
    if (
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        req.params.id
      )
    ) {
      whereCondition = { id: req.params.id };
    } else if (!isNaN(req.params.id)) {
      whereCondition = { id: req.params.id };
    } else {
      return res.status(400).json({ msg: "Invalid ID format" });
    }

    const movie = await movies.findOne({
      where: whereCondition,
    });

    if (!movie) {
      return res.status(404).json({ msg: "Movie not found" });
    }

    // Simpan path gambar ke dalam entri movies
    const imagePath = req.file.path;
    movie.photo = imagePath;
    await movie.save(); // Simpan perubahan

    return res
      .status(200)
      .json({ msg: "Movie photo updated successfully", imagePath });
  } catch (error) {
    next(error);
  }
};
