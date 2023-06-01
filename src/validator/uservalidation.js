const Joi = require('joi');

module.exports.validateSignUp = (
  userName,
  email,
  firstName,
  lastName,
  password,
  dateOfBirth,
  gender
) => {
  let dateNow = new Date();
  dateNow = dateNow.setFullYear(dateNow.getFullYear() - 5);
  let dateThen = dateNow - 95;

  const schema = Joi.object({
    firstName: Joi.string()
      .regex(/^[A-Za-z]+$/)
      .required()
      .messages({
        'string.base': `First name should be a type of 'text'.`,
        'string.empty': `First name cannot be an empty field.`,
        'string.pattern.base': `First name should only contain letters.`,
      }),
    lastName: Joi.string()
      .regex(/^[A-Za-z]+$/)
      .required()
      .messages({
        'string.base': `Last name should be a type of 'text'.`,
        'string.empty': `Last name cannot be an empty field.`,
        'string.pattern.base': `Last name should only contain letters.`,
      }),
    userName: Joi.string().required(),
    email: Joi.string()
      .regex(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
      .required()
      .messages({
        'string.base': `Email should be a type of 'text'.`,
        'string.empty': `Email cannot be an empty field.`,
        'string.pattern.base': `Email should be a valid email address.`,
      }),
    password: Joi.string().min(4).required().messages({
      'string.base': `Password should be a type of 'text'.`,
      'string.empty': `Password cannot be an empty field.`,
      'string.min': `Password should have a minimum length of {#limit}.`,
    }),
    dateOfBirth: Joi.required(),
    gender: Joi.string().required(),
  });
  const { error, value } = schema.validate({
    userName,
    email,
    firstName,
    lastName,
    password,
    dateOfBirth,
    gender,
  });

  if (error) {
    console.log(error.details[0].message);
    return error.details.map((detail) => detail.message);
  } else {
    return true;
  }
};

module.exports.validateLogin = (email, password) => {
  const schema = Joi.object({
    email: Joi.string()
      .regex(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
      .required()
      .messages({
        'string.base': `Email should be a type of 'text'.`,
        'string.empty': `Email cannot be an empty field.`,
        'string.pattern.base': `Email should be a valid email address.`,
      }),
    password: Joi.string().min(4).required().messages({
      'string.base': `Password should be a type of 'text'.`,
      'string.empty': `Password cannot be an empty field.`,
      'string.min': `Password should have a minimum length of {#limit}.`,
    }),
  });

  const { error, value } = schema.validate({ email, password });
  if (error) {
    console.log(error.details[0].message);
    return error.details.map((detail) => detail.message);
  } else {
    return true;
  }
};
