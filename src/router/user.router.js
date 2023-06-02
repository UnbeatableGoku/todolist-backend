const express = require('express');
const {
  signUpUser,
  validateUser,
  verifyTokenEmail,
  authUserController,
  createTaskController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
  logoutController,
} = require('../controller/user.controller');

const router = express.Router();

router.post('/createuser', signUpUser);
router.post('/auth', validateUser);
router.post('/logout', logoutController);

router.use('/', verifyTokenEmail);
router.post('/createtask', createTaskController);
router.get('/protected', authUserController);
router.get('/gettask', getTaskController);
router.put('/updatetask', updateTaskController);
router.delete('/deletetask/:id', deleteTaskController);

module.exports = router;
