import userService from "../services/userService.js";

class userController {
  //find all users
  static findAll = async (req, res, next) => {
    try {
      const user = await userService.findAll(req.query);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  //find user by id
  static findOne = async (req, res, next) => {
    try {
      const user = await userService.findOne(req.params.id);
      res.status(200).json({
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };

  //create a new user
  static create = async (req, res) => {
    try {
      await userService.create(req.body);
      res.status(200).json({ msg: "Created Account Successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  //update user account
  static update = async (req, res, next) => {
    try {
      const params = {
        id: req.params.id,
        body: req.body,
      };

      await userService.update(params);

      res.status(200).json({ message: "Users Account updated successfully" });
    } catch (err) {
      next(err);
    }
  };

  //user Delete Account
  static destroy = async (req, res, next) => {
    try {
      await userService.destroy(req.params.id);

      res.status(200).json({ message: "User Account Has Been Deleted" });
    } catch (err) {
      next(err);
    }
  };
}

export default userController;
