import authentication from '../middleware/authentication';
import { createUser, loginUser, allUser, findUser,
updateUser, deleteUser } from '../controllers/user';

const Routes = (apiRoutes) => {
  apiRoutes
  .post('/users', createUser)
  .get('/users', authentication.verifyToken, allUser)
  .get('/users/:id', authentication.verifyToken, findUser)
  .post('/users/login', loginUser)
  .put('/users/:id', authentication.verifyToken, updateUser)
  .delete('/users/:id', authentication.verifyToken, deleteUser);
};

export default Routes;
