import MovieService from "../services/movieService.js";

class MovieController {
  //Get All Movies
  static findAll = async (req, res, next) => {
    try {
      const movies = await MovieService.findAll(req.query);
      res.status(200).json(movies);
    } catch (err) {
      next(err);
    }
  };

  // Get Movie by id
  static findOne = async (req, res, next) => {
    try {
      const movie = await MovieService.findOne(req.params.id);
      res.status(200).json({
        data: movie,
      });
    } catch (err) {
      next(err);
    }
  };

  //create a new movie
  static create = async (req, res, next) => {
    try {
      const movie = await MovieService.create(req.body);

      res.status(200).json({
        message: "Movie created successfully",
        data: movie,
      });
    } catch (err) {
      next(err);
    }
  };

  //update movie
  static update = async (req, res, next) => {
    try {
      const params = {
        id: req.params.id,
        body: req.body,
      };

      await MovieService.update(params);

      res.status(200).json({ message: "Movies updated successfully" });
    } catch (err) {
      next(err);
    }
  };

  // destroy
  static destroy = async (req, res, next) => {
    try {
      await MovieService.destroy(req.params.id);

      res.status(200).json({ message: "Movie deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
}

export default MovieController;
