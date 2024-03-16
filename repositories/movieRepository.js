import movies from "../models/movies.js";

class MovieRepository {
  static findAll = async (params) => {
    try {
      const { count, rows } = await movies.findAndCountAll(params);
      return {
        count,
        rows,
      };
    } catch (error) {
      throw error;
    }
  };

  static findOne = async (params) => {
    try {
      const movie = await movies.findOne(params);
      return movie;
    } catch (err) {
      throw err;
    }
  };

  static create = async (params) => {
    try {
      const movie = await movies.create(params, {
        returning: true,
      });
      return movie;
    } catch (error) {
      throw error;
    }
  };

  static update = async (id, body) => {
    try {
      const movie = await movies.findOne({
        where: {
          id,
        },
      });

      if (!movie)
        throw {
          name: "ErrorNotFound",
          message: "Game not found",
        };
      await movie.update(body);
    } catch (err) {
      throw err;
    }
  };

  static destroy = async (params) => {
    try {
      const movie = await movies.findOne(params);

      if (!movie) throw { name: "ErrorNotFound", message: "Movie not found" };

      await movie.destroy();
    } catch (err) {
      throw err;
    }
  };
}

export default MovieRepository;
