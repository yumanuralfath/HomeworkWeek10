import users from "../models/users.js";

class userRepository {
  static findAll = async (params) => {
    try {
      const { count, rows } = await users.findAndCountAll(params);
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
      const user = await users.findOne(params);
      return user;
    } catch (err) {
      throw err;
    }
  };

  static create = async (userData) => {
    try {
      const { email, gender, password, role } = userData;
      const user = new users({ email, gender, password, role });
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  };

  static update = async (id, body) => {
    try {
      const user = await users.findOne({
        where: {
          id,
        },
      });

      if (!user)
        throw {
          name: "ErrorNotFound",
          message: "user not found",
        };
      await user.update(body);
    } catch (err) {
      throw err;
    }
  };

  static destroy = async (params) => {
    try {
      const user = await users.findOne(params);

      if (!user) throw { name: "ErrorNotFound", message: "user not found" };

      await user.destroy();
    } catch (err) {
      throw err;
    }
  };
}

export default userRepository;
