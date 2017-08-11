import { verifyToken } from '../middleware/authentication';
import { createUser, loginUser, allUser, findUser,
  updateUser, deleteUser } from '../controllers/user';

const Routes = (apiRoutes) => {
  apiRoutes
  .post('/users', createUser)
  .get('/users', verifyToken, allUser)
  .get('/users/:id', verifyToken, findUser)
  .post('/users/login', loginUser)
  .put('/users/:id', verifyToken, updateUser)
  .delete('/users/:id', verifyToken, deleteUser);
};

export default Routes;
