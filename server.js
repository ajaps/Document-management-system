import bodyParser from 'body-parser';
import express from 'express';
import expressValidator from 'express-validator';
import { createUser, loginUser, allUser, findUser,
updateUser, deleteUser } from './server/routes/user';
import { createDocument, getAllDocument } from './server/routes/documents';
import authentication from './server/middleware/authentication';

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
.get('/documents', authentication.verifyToken, getAllDocument);

server.listen(3004, () => {
});

module.exports = server;
