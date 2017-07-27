import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

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

module.exports = {
  verifyToken,
  setUserToken,
};
