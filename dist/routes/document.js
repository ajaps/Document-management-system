'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _authentication = require('../middleware/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _documents = require('../controllers/documents');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Routes = function Routes(apiRoutes) {
  apiRoutes.post('/documents', _authentication2.default.verifyToken, _documents.createDocument).get('/documents', _authentication2.default.verifyToken, _documents.getAllDocument).put('/documents/:id', _authentication2.default.verifyToken, _documents.updateDocument).delete('/documents/:id', _authentication2.default.verifyToken, _documents.deleteDocument).get('/documents/users/:id', _authentication2.default.verifyToken, _documents.getDocumentByUserId).get('/documents/roles/:id', _authentication2.default.verifyToken, _documents.getDocumentByRole);
};

exports.default = Routes;