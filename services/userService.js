import userRepository from '../repositories/userRespository.js'
import { Op } from 'sequelize'
import { hashPassword } from '../lib/bcrypt.js'
import pagination from '../services/pagination.js'
const DEFAULT_LIMIT = 10
const DEFAULT_PAGE = 1

class userService {
  static findAll = async (params) => {
    try {
      let { gender, role, page, limit } = params

      const filterOptions = {
        where: {}
      }

      let genderFilter = {}
      let roleFilter = {}

      if (gender) {
        genderFilter = {
          gender: {
            [Op.iLike]: `%${gender}%`
          }
        }
      }

      if (role) {
        roleFilter = {
          role: {
            [Op.iLike]: `%${role}%`
          }
        }
      }

      filterOptions.where = {
        ...genderFilter,
        ...roleFilter
      }
      limit = +limit || DEFAULT_LIMIT
      page = +page || DEFAULT_PAGE
      const offset = (page - 1) * limit

      filterOptions.limit = limit
      filterOptions.offset = offset

      const { count, rows } = await userRepository.findAll(filterOptions)
      const paginatedResults = pagination(page, limit, rows)

      return {
        data: rows,
        totalData: count,
        paginatedResults
      }
    } catch (err) {
      throw err
    }
  }

  static findOne = async (id) => {
    try {
      const filterOptions = {
        where: {
          id
        }
      }

      const user = await userRepository.findOne(filterOptions)
      if (!user) throw { name: 'ErrorNotFound', message: 'user Not Found' }

      return user
    } catch (err) {
      throw err
    }
  }

  static create = async (userData) => {
    try {
      const { email, gender, Password, confirmPassword, role } = userData

      // check if password and confirmPassword are valid
      if (Password !== confirmPassword) { throw new Error('Password and confirmPassword are not valid ') }

      // check if password empty
      if (Password === '' || Password === null) { throw new Error('Empty password not allowed') }

      // check email valid
      const emailRegex =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      // email regex pattern
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format')
      }

      // hashed password before send to server
      const hashPass = hashPassword(Password)

      // check if only gender are allowed
      if (gender !== 'male' && gender !== 'female') {
        throw new Error("Invalid gender format (must be 'male' or 'female')")
      }

      // send to DB
      const user = await userRepository.create({
        ...userData,
        password: hashPass
      })
      return user
    } catch (err) {
      throw err
    }
  }

  static update = async (params) => {
    try {
      const { id, body } = params
      await userRepository.update(id, body)
    } catch (err) {
      throw err
    }
  }

  static destroy = async (id) => {
    try {
      const filterOptions = {
        where: {
          id
        }
      }
      await userRepository.destroy(filterOptions)
    } catch (err) {
      throw err
    }
  }
}

export default userService
