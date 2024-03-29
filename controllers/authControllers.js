import users from '../models/users.js'
import { generateToken } from '../lib/jwt.js'
import { comparePassword } from '../lib/bcrypt.js'

// fuction for generate token
// const createTOken = () => {
//   const payload = {
//     userId: users.id,
//     email: users.email,
//     role: users.role,
//   };
//   const token = jwt.sign(payload, process.env.SESS_SECRET, { expiresIn: "1h" });
//   return token;
// };

// //Login
// export const login = async (req, res) => {
//   try {
//     const user = await users.findOne({
//       //check if user available
//       where: {
//         email: req.body.email,
//       },
//     });
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     //check a password
//     const match = await bcrypt.compare(req.body.Password, user.password);
//     if (match) {
//       const token = createTOken(user);
//       res.status(200).json({ token: token });
//     } else {
//       res.status(401).json({ msg: "Incorrect password" });
//     }
//   } catch (error) {
//     res.status(500).json({ msg: "Error: " + error.message });
//   }
// };

// login
export const login = async (req, res, next) => {
  try {
    const user = await users.findOne({
      where: {
        email: req.body.email
      }
    })
    if (!user) return res.status(404).json({ msg: 'User not found' })
    const match = await comparePassword(req.body.Password, user.password)
    if (!match) return res.status(400).json({ msg: 'Wrong password' })
    const id = user.id
    const name = user.email
    const roles = user.role
    const payload = {
      userID: id,
      email: name,
      role: roles
    }
    const token = generateToken(payload, user)
    console.log(token)
    req.session.token = token
    req.session.userID = id
    res.status(200).json({ id, name, roles, token })
  } catch (error) {
    next(error)
  }
}

// check account for auth
export const me = async (req, res) => {
  try {
    if (!req.session.token) {
      return res.status(401).json({ msg: 'Please Login again' })
    }
    const user = await users.findOne({
      attributes: ['id', 'email', 'gender', 'role'],
      where: {
        id: req.session.userID
      }
    })
    if (!user) {
      return res
        .status(404)
        .json({ msg: 'User not found , Please Login Again' })
    }
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

// LogOut For Destroy Session
export const logout = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })

    res.status(200).json({ msg: 'Log Out Success' })
  } catch (error) {
    next(error)
  }
}
