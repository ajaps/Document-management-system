import dotenv from 'dotenv';
import util from 'util';
import jwt from 'jsonwebtoken';

dotenv.config();
const secretKey = process.env.SECRET;

const verifyUserParams = (request) => {
  request.assert('email', 'email field is required').notEmpty();
  request.assert('email', 'valid email address is required').isEmail();
  request.assert('password', 'password field is required').notEmpty();
  request.assert('password', '8 to 20 characters required').len(8, 20);
  const errors = request.validationErrors();
  if (errors) {
    return {
      message: util.inspect(errors)
    };
  }
  return {
    error: false,
    message: null
  };
};

const setUserToken = (user) => {
  const userToken = jwt.sign({
    data: user }, secretKey, { expiresIn: '12h' },
  );
  return userToken;
};

module.exports = {
  verifyUserParams,
  setUserToken,
};
