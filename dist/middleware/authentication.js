'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var SECRET_KEY = process.env.SECRET;

var setUserToken = function setUserToken(user) {
  var userToken = _jsonwebtoken2.default.sign({
    data: user }, SECRET_KEY, { expiresIn: '12h' });
  return userToken;
};

var verifyToken = function verifyToken(request, response, next) {
  var token = request.body.token || request.headers.authorization || request.headers['x-access-token'];
  if (token) {
    _jsonwebtoken2.default.verify(token, SECRET_KEY, function (error, decoded) {
      if (error) {
        response.status(401).json({ message: 'Invalid token' });
      }
      request.decoded = decoded;
      next();
    });
  } else {
    response.status(428).json('A token is requeired for authentication');
  }
};

var adminPass = function adminPass(request, response, next) {
  var isAdmin = request.decoded.data.roleId === 1;
  if (!isAdmin) {
    return response.status(401).json({
      message: 'Admin priviledges is required to create new roles'
    });
  }
  next();
};

module.exports = {
  verifyToken: verifyToken,
  setUserToken: setUserToken,
  adminPass: adminPass
};