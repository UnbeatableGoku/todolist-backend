const { UserTask } = require('../model/userTaskSchema');

/**
 * Adds a task to the user's task list.
 *
 * @param {string} email - User's email.
 * @param {Object} taskData - Task data to be added.
 * @returns {Object|null} - The newly added task object, or null if the task could not be added.
 * @throws {Error} - If an error occurs while adding the task.
 */
const addTaskService = async (email, taskData) => {
  try {
    const userTask = await UserTask.findOne({ email });
    if (userTask) {
      userTask.task.push(taskData);
      await userTask.save();
      const newTask = userTask.task[userTask.task.length - 1];
      return newTask;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Retrieves the task list of a user.
 *
 * @param {string} email - User's email.
 */
const getTaskService = async (email) => {
  try {
    const response = await UserTask.findOne({ email });
    if (response) {
      return response.task;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Updates the status of a task.
 *
 * @param {string} email - User's email.
 * @param {string} taskId - ID of the task to be updated.
 * @param {string} newStatus - New status for the task.
 */
const updateTaskService = async (email, taskId, newStatus) => {
  try {
    const result = await UserTask.findOneAndUpdate(
      { email, 'task._id': taskId },
      { $set: { 'task.$.status': newStatus } },
      { new: true }
    );
    const updatedValue = result.task.find(
      (item) => item._id.toString() === taskId
    );
    return updatedValue;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Deletes a task from the user's task list.
 *
 * @param {string} email - User's email.
 * @param {string} taskId - ID of the task to be deleted.
 */
const deleteTaskService = async (email, taskId) => {
  console.log(taskId);
  try {
    const result = await UserTask.findOneAndUpdate(
      { email },
      { $pull: { task: { _id: taskId } } },
      { new: true }
    );
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addTaskService,
  getTaskService,
  updateTaskService,
  deleteTaskService,
};
