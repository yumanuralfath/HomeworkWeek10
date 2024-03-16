import MovieRepository from "../repositories/movieRepository.js";
import { Op } from "sequelize";
import pagination from "../services/pagination.js";
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

class MovieService {
  static findAll = async (params) => {
    try {
      let { title, genres, year, page, limit } = params;

      let filterOptions = {
        where: {},
      };

      let titleFilter = {};
      let genresFilter = {};
      let yearFilter = {};

      if (title)
        titleFilter = {
          title: {
            [Op.iLike]: `%${title}%`,
          },
        };

      if (genres)
        genresFilter = {
          genres: {
            [Op.iLike]: `%${genres}%`,
          },
        };

      if (year)
        yearFilter = {
          year: +year,
        };

      filterOptions.where = {
        ...titleFilter,
        ...genresFilter,
        ...yearFilter,
      };
      limit = +limit || DEFAULT_LIMIT;
      page = +page || DEFAULT_PAGE;
      const offset = (page - 1) * limit;

      filterOptions.limit = limit;
      filterOptions.offset = offset;

      const { count, rows } = await MovieRepository.findAll(filterOptions);
      const paginatedResults = pagination(page, limit, rows);

      return {
        data: rows,
        totalData: count,
        paginatedResults,
      };
    } catch (err) {
      throw err;
    }
  };

  static findOne = async (id) => {
    try {
      const filterOptions = {
        where: {
          id,
        },
      };

      const movie = await MovieRepository.findOne(filterOptions);
      if (!movie) throw { name: "ErrorNotFound", message: "Movie Not Found" };

      return movie;
    } catch (err) {
      throw err;
    }
  };

  static create = async (params) => {
    try {
      const movie = await MovieRepository.create(params);
      return movie;
    } catch (err) {
      throw err;
    }
  };

  static update = async (params) => {
    try {
      const { id, body } = params;
      await MovieRepository.update(id, body);
    } catch (err) {
      throw err;
    }
  };

  static destroy = async (id) => {
    try {
      const filterOptions = {
        where: {
          id,
        },
      };
      await MovieRepository.destroy(filterOptions);
    } catch (err) {
      throw err;
    }
  };
}

export default MovieService;
