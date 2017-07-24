import bodyParser from 'body-parser';
import express from 'express';
import expressValidator from 'express-validator';
import { addUser, loginUser, allUser } from './server/routes/user';
import authentication from './server/middleware/authentication';

const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(expressValidator());

const apiRoutes = express.Router();
server.use('/api/v1', apiRoutes);

apiRoutes.all('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Document Management System API' });
});

apiRoutes
.post('/users', addUser)
.get('/users', authentication.verifyToken, allUser)
.post('/users/login', loginUser);

server.listen(3004, () => {
});

module.exports = server;
