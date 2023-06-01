const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');
const { UserTask } = require('../model/userTaskSchema');
dotenv.config();

/**
 * @description Get user by email from database
 * @param {String} email - User's email address
 */
const getUserByEmail = async (email) => {
  try {
    const userExist = await User.findOne({ email });
    return userExist;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Create a new user in the database
 * @param {String} userName - User's username
 * @param {String} email - User's email address
 * @param {String} firstName - User's first name
 * @param {String} lastName - User's last name
 * @param {String} encryptedPassword - User's encrypted password
 * @param {Date} dob - User's date of birth
 * @param {String} gender - User's gender
 */

const createUserService = async (
  userName,
  email,
  firstName,
  lastName,
  password,
  dateOfBirth,
  gender
) => {
  try {
    const user = new User({
      firstName,
      lastName,
      userName,
      email,
      password,
      dateOfBirth,
      gender,
    });
    const data = await user.save();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Create a JWT token for a user
 * @param {String} userId - User's ID in the database
 * @param {String} email - User's email address
 */
const createToken = async (id, email) => {
  try {
    const token = jwt.sign(
      {
        id: id,
        email: email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: 86400, //one day
      }
    );
    return token;
  } catch (error) {
    console.log(error);
  }
};

const createDefaultTaskServices = async (email) => {
  try {
    const newTask = new UserTask({ email: email });
    const response = await newTask.save();
    return response;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getUserByEmail,
  createUserService,
  createToken,
  createDefaultTaskServices,
};
