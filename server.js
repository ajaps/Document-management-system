import bodyParser from 'body-parser';
import express from 'express';
import expressValidator from 'express-validator';
import routes from './routes/index';

const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(expressValidator());

const apiRoutes = express.Router();

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
