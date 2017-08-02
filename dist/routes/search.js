'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _authentication = require('../middleware/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _search = require('../controllers/search');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Routes = function Routes(apiRoutes) {
  apiRoutes.get('/search/users', _authentication2.default.verifyToken, _search.searchUser).get('/search/documents', _authentication2.default.verifyToken, _search.searchDocument);
};

exports.default = Routes;