import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import models from '../models/index';

dotenv.config();
const SECRET_KEY = process.env.SECRET;

const setUserToken = (user) => {
  const userToken = jwt.sign({
    data: user }, SECRET_KEY, { expiresIn: '12h' },
  );
  return userToken;
};


const verifyToken = (request, response, next) => {
  const token = request.body.token || request.headers.authorization ||
      request.headers['x-access-token'];
  if (token) {
    jwt.verify(token, SECRET_KEY, (error, decoded) => {
      if (error) {
        response.status(401).json({ message: 'Invalid token' });
      }
      request.decoded = decoded;
      next();
    });
  } else {
    response.status(428).json({
      message: 'A token is requeired for authentication'
    });
  }
};

const validateAdmin = (request, response, next) => {
  models.Role.findOne({
    where:
    { roleName:
      { $iLike: 'admin' }
    }
  })
  .then((result) => {
    if (!(request.decoded.data.roleId === result.id)) {
      response.status(401).json({
        message: 'Oops! You need admin priviledges to perform this action!!',
      });
    } else {
      next();
    }
  })
  .catch(() => {
    response.status(400).json({
      message: `Sorry, Admin priviledges is required to perform this operation
       No Administrator was found in the database`,
    });
  });
};


module.exports = {
  verifyToken,
  setUserToken,
  validateAdmin,
};
