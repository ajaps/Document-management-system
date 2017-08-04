import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import expressValidator from 'express-validator';
import path from 'path';
import routes from './server/routes';

dotenv.config();

const server = express();

server.use(express.static(path.join(__dirname, '../Documentation')));
// server.use(express.static(path.resolve(`${__dirname}./public`)));


server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(expressValidator());

const apiRoutes = express.Router();


server.all('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'Documentation', 'index.html'));
});

server.all('/v1', (req, res) => {
  res.redirect(302, '/');
});

routes(apiRoutes);
server.use('/api/v1', apiRoutes);

apiRoutes.all('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Document Management System API'
  });
});

server.listen(process.env.PORT || 3004, () => {
});

module.exports = server;
