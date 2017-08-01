'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _authentication = require('../middleware/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _user = require('../controllers/user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Routes = function Routes(apiRoutes) {
  apiRoutes.post('/users', _user.createUser).get('/users', _authentication2.default.verifyToken, _user.allUser).get('/users/:id', _authentication2.default.verifyToken, _user.findUser).post('/users/login', _user.loginUser).put('/users/:id', _authentication2.default.verifyToken, _user.updateUser).delete('/users/:id', _authentication2.default.verifyToken, _user.deleteUser);
};

exports.default = Routes;