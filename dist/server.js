'use strict';

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressValidator = require('express-validator');

var _expressValidator2 = _interopRequireDefault(_expressValidator);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _routes = require('./server/routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var server = (0, _express2.default)();

server.use(_express2.default.static(_path2.default.join(__dirname, '../Documentation')));
// server.use(express.static(path.resolve(`${__dirname}./public`)));


server.use(_bodyParser2.default.urlencoded({ extended: false }));
server.use(_bodyParser2.default.json());
server.use((0, _expressValidator2.default)());

var apiRoutes = _express2.default.Router();

server.all('/', function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname, 'Documentation', 'index.html'));
});

server.all('/v1', function (req, res) {
  res.redirect(302, '/');
});

(0, _routes2.default)(apiRoutes);
server.use('/api/v1', apiRoutes);

apiRoutes.all('/', function (req, res) {
  res.status(200).json({
    message: 'Welcome to Document Management System API'
  });
});

server.listen(process.env.PORT || 3004, function () {});

module.exports = server;