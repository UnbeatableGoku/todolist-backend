const bcrypt = require('bcrypt');

/**
 * @description Encrypt password using bcrypt
 * @param {String} password - User's password
 */
const encrpytPasswordService = async (password) => {
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Decrypt password using bcrypt
 * @param {String} password - User's password
 * @param {String} encryptedPassword - Encrypted password
 */
const decryptPasswordService = async (password, encryptPassword) => {
  try {
    const decryptPassword = await bcrypt.compare(password, encryptPassword);
    return decryptPassword;
  } catch (error) {
    throw error;
  }
};
module.exports = { encrpytPasswordService, decryptPasswordService };
