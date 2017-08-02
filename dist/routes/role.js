'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _authentication = require('../middleware/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _role = require('../controllers/role');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Routes = function Routes(apiRoutes) {
  apiRoutes.get('/roles', _authentication2.default.verifyToken, _role.getAllRoles).post('/roles', _authentication2.default.verifyToken, _authentication2.default.adminPass, _role.createRole).put('/roles/:id', _authentication2.default.verifyToken, _authentication2.default.adminPass, _role.updateRole);
};

exports.default = Routes;