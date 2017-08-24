import { verifyToken } from '../middleware/authentication';
import { createUser, loginUser, allUser, findUser,
  setUpdatedUser, deleteUser } from '../controllers/user';

const UserRoutes = (apiRoutes) => {
  apiRoutes
  .post('/users', createUser)
  .get('/users', verifyToken, allUser)
  .get('/users/:id', verifyToken, findUser)
  .post('/users/login', loginUser)
  .put('/users/:id', verifyToken, setUpdatedUser)
  .delete('/users/:id', verifyToken, deleteUser);
};

export default UserRoutes;
