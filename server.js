import restify from 'restify';
import restifyValidator from 'restify-validator';
import { addUser, loginUser } from './server/routes/user';

const server = restify.createServer();

server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(restifyValidator);

server.post('/api/v1/user', addUser);
server.get('/api/v1/user/login', loginUser);

server.listen(3004, () => {
});

module.exports = server;
