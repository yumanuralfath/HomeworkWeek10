import users from "../models/users.js";
import { hashPassword } from "../lib/bcrypt.js";
import pagination from "../services/pagination.js";

//Get all users Account
export const getUsers = async (req, res, next) => {
  try {
    const allUser = await users.findAll();
    const page = parseInt(req.query.page) || 1; //parse page default page 1
    const limit = parseInt(req.query.limit) || 10; //parse limit default 10
    const paginatedResults = pagination(page, limit, allUser);
    return res.status(200).json(paginatedResults);
  } catch (error) {
    next(error);
  }
};

//Get User Profile By ID
export const getUsersById = async (req, res, next) => {
  try {
    //check if user is already in the database
    const { id } = req.params;
    const UserID = await users.findByPk(id);
    if (!UserID) {
      return res.status(404).json({ msg: "User not found" });
    }
    //if user is already in the database
    res.status(200).json(UserID);
  } catch (error) {
    next(error);
  }
};

// export const createUsers = async (req, res, next) => {
//   try {
//     const { email, gender, Password, confirmPassword, role } = req.body;
//     //check password and confirm password same
//     if (Password !== confirmPassword) {
//       res.status(400).json({ msg: "Password !== confirmPassword" });
//     }
//     //check password not empty
//     if (Password === "" || Password === null) {
//       res.status(400).json({ msg: "empty password not allowed" });
//       //hash password and send to database
//     } else {
//       const saltRounds = 8;
//       bcrypt
//         .hash(Password, saltRounds)
//         .then((hash) => {
//           const password = hash;
//           users.create({
//             email,
//             gender,
//             password,
//             role,
//           });
//           res.status(201).json({ msg: "Register User successfully" });
//         })
//         .catch((err) => console.error(err.message));
//     }
//   } catch (error) {
//     next(error);
//   }
// };

export const createUsers = async (req, res, next) => {
  //Create User Account V.2.0
  try {
    const { email, gender, Password, confirmPassword, role } = req.body;
    //check password and confirm password same
    if (Password !== confirmPassword) {
      return res
        .status(400)
        .json({ msg: "Password and confirmPassword are note same" });
    }
    //check password not empty
    if (Password === "" || Password === null) {
      return res.status(400).json({ msg: "empty password not allowed" });
      //hash password and send to database
    } else {
      const hashPass = hashPassword(Password);
      const password = hashPass;
      await users.create({
        email,
        gender,
        password,
        role,
      });
      return res.status(200).json({ msg: "Created Account Succesfull" });
    }
  } catch (error) {
    next(error);
  }
};

//updateUser
export const updateUsers = async (req, res, next) => {
  try {
    //check if user already exists
    const { id } = req.params;
    const { email, gender, password, role } = req.body;
    const existingUsers = await users.findByPk(id);
    if (!existingUsers) return res.status(404).json({ msg: "User not found" });

    //if user is already exist
    await existingUsers.update({
      email: email || existingUsers.title,
      gender: gender || existingUsers.gender,
      password: password || existingUsers.password,
      role: role || existingUsers.role,
    });

    //send response if update is successful
    res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    next(error);
  }
};

//delete user
export const deleteUser = async (req, res, next) => {
  try {
    //check if user already exists
    const { id } = req.params;
    const existingUsers = await users.findByPk(id);
    if (!existingUsers) return res.status(404).json({ msg: "User not found" });

    // if user already exists
    await existingUsers.destroy();
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
