'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _document = require('./document');

var _document2 = _interopRequireDefault(_document);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _search = require('./search');

var _search2 = _interopRequireDefault(_search);

var _role = require('./role');

var _role2 = _interopRequireDefault(_role);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = function routes(router) {
  (0, _user2.default)(router);
  (0, _search2.default)(router);
  (0, _document2.default)(router);
  (0, _role2.default)(router);
};

exports.default = routes;