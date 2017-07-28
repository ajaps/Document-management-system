import bodyParser from 'body-parser';
import express from 'express';
import expressValidator from 'express-validator';
import { createUser, loginUser, allUser, findUser,
updateUser, deleteUser } from './server/controllers/user';
import { createDocument, getAllDocument, updateDocument,
 getDocumentByUserId } from './server/controllers/documents';
import authentication from './server/middleware/authentication';
import { searchUser, searchDocument } from './server/controllers/search';

const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(expressValidator());

const apiRoutes = express.Router();
server.use('/api/v1', apiRoutes);

apiRoutes.all('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Document Management System API'
  });
});

apiRoutes
.post('/users', createUser)
.get('/users', authentication.verifyToken, allUser)
.get('/users/:id', authentication.verifyToken, findUser)
.post('/users/login', loginUser)
.put('/users/:id', authentication.verifyToken, updateUser)
.delete('/users/:id', authentication.verifyToken, deleteUser);

apiRoutes
.post('/documents', authentication.verifyToken, createDocument)
.get('/documents', authentication.verifyToken, getAllDocument)
.put('/documents/:id', authentication.verifyToken, updateDocument)
.get('/users/:id/documents', authentication.verifyToken, getDocumentByUserId);


apiRoutes
.get('/search/users', authentication.verifyToken, searchUser)
.get('/search/documents', authentication.verifyToken, searchDocument);


server.listen(3004, () => {
});

module.exports = server;
