import auth from '../middleware/authentication';
import { getAllRoles, createRoles } from '../controllers/role';

const Routes = (apiRoutes) => {
  apiRoutes
  .get('/roles', auth.verifyToken, getAllRoles)
  .post('/roles', auth.verifyToken, auth.adminPass, createRoles);
};

export default Routes;
