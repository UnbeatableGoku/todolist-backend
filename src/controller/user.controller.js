const jwt = require('jsonwebtoken');

const {
  encrpytPasswordService,
  decryptPasswordService,
} = require('../services/encryption');
const {
  addTaskService,
  getTaskService,
  updateTaskService,
  deleteTaskService,
} = require('../services/taskservices');
const {
  getUserByEmail,
  createUserService,
  createToken,
  createDefaultTaskServices,
} = require('../services/userservices');
const {
  validateSignUp,
  validateLogin,
} = require('../validator/uservalidation');

/**
 * @description Sign up a new user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response object
 */

const signUpUser = async (req, res) => {
  try {
    const {
      userName,
      email,
      firstName,
      lastName,
      password,
      dateOfBirth,
      gender,
    } = req.body;
    console.log('this is rq.body', req.body);
    const dataValidation = validateSignUp(
      userName,
      email,
      firstName,
      lastName,
      password,
      dateOfBirth,
      gender
    );
    if (dataValidation.length > 0) {
      return res.status(400).json({ error: dataValidation[0] });
    }
    const userExist = await getUserByEmail(email);

    if (userExist) {
      return res.status(400).json({ error: 'user is already exist' });
    }

    const encryptedPassword = await encrpytPasswordService(password);

    const createUser = await createUserService(
      userName,
      email,
      firstName,
      lastName,
      encryptedPassword,
      dateOfBirth,
      gender
    );

    const createDefaultTask = await createDefaultTaskServices(email);
    return res.status(200).json({
      success: true,
      message: 'User Created Successfully',
      data: createUser,
      task: createDefaultTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

/**
 * @description Authenticate user with email and password
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response object
 */

const validateUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const dataValidation = validateLogin(email, password);
    if (dataValidation.length > 0) {
      return res.status(400).json({ error: dataValidation[0] });
    }
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ error: 'wrong credentials' });
    const decryptPassword = await decryptPasswordService(
      password,
      user.password
    );
    if (decryptPassword) {
      const token = await createToken(user._id, user.email);
      const secure = req.secure ? true : false;

      return res
        .cookie('jwt', token, { sameSite: 'none', httpOnly: true,maxAge:24 * 60 * 60 * 1000 })
        .json({ message: true, data: user });
    } else {
      return res.status(404).json({ error: 'wrong credentials' });
    }
  } catch (error) {
    res.status(400).json({ error: error });
    console.log(error);
  }
};

/**
 * Verifies the user token and stores the email address in the res.locals object for further use.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {void}
 */

const verifyTokenEmail = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    let decode = jwt.verify(token, process.env.SECRET_KEY);
    if (decode.email) {
      res.locals.email = decode.email;
      next();
    } else {
      return res.status(401).json({ auth: false, error: 'unAuthorized User' });
    }
  } else {
    return res.status(404).json({ auth: false});
  }
};

/**
 * Sends a success response indicating that the user is authorized.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

const authUserController = async (req, res) => {
  const email = res.locals.email;
  try {
    const user = await getUserByEmail(email);
    res.json({
      auth: true,
      message: 'Authorized User',
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Create a new task for the user.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The task data to be created.
 * @param {string} res.locals.email - The email of the authenticated user.
 * @param {Object} res - The response object.
 */
const createTaskController = async (req, res) => {
  const taskData = req.body;
  const email = res.locals.email;
  try {
    const addTask = await addTaskService(email, taskData);
    if (addTask) {
      res.status(200).json({ response: addTask });
    } else {
      res.status(500).json({ error: 'Failed to add task' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

/**
 * Get the tasks for the user.
 * @param {Object} req - The request object.
 * @param {string} res.locals.email - The email of the authenticated user.
 * @param {Object} res - The response object.
 */
const getTaskController = async (req, res) => {
  const email = res.locals.email;
  try {
    const userTaskData = await getTaskService(email);
    if (userTaskData.length > 0) {
      res.status(200).json({ response: userTaskData });
    } else {
      res.status(404).json({ error: 'no user found ' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Update the status of a task.
 * @param {Object} req - The request object.
 * @param {string} res.locals.email - The email of the authenticated user.
 * @param {Object} req.body - The updated status and task ID.
 * @param {string} req.body.newStatus - The new status of the task.
 * @param {string} req.body.id - The ID of the task to update.
 * @param {Object} res - The response object.
 */
const updateTaskController = async (req, res) => {
  const email = res.locals.email;
  const { newStatus, id } = req.body;
  try {
    const updatedTask = await updateTaskService(email, id, newStatus);
    if (updatedTask) {
      res
        .status(200)
        .json({ response: updatedTask, message: 'updated successfully' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Delete a task.
 * @param {Object} req - The request object.
 * @param {string} res.locals.email - The email of the authenticated user.
 * @param {Object} req.params - The task ID to delete.
 * @param {string} req.params.id - The ID of the task to delete.
 * @param {Object} res - The response object.
 */
const deleteTaskController = async (req, res) => {
  const email = res.locals.email;
  const { id } = req.params;
  try {
    const updatedTask = await deleteTaskService(email, id);
    if (updatedTask) {
      res
        .status(200)
        .json({ response: updatedTask, message: 'updated successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};

const logoutController = async (req, res) => {
  console.log('logout');
  return res
        .cookie('jwt','',{ sameSite: 'none', httpOnly: true })
        .json({ message: true });
};
module.exports = {
  signUpUser,
  validateUser,
  verifyTokenEmail,
  authUserController,
  createTaskController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
  logoutController,
};
