import auth from '../middleware/authentication';
import { getAllRoles, createRole, updateRole } from '../controllers/role';

const Routes = (apiRoutes) => {
  apiRoutes
  .get('/roles', auth.verifyToken, getAllRoles)
  .post('/roles', auth.verifyToken, auth.adminPass, createRole)
  .put('/roles/:id', auth.verifyToken, auth.adminPass, updateRole);
};

export default Routes;
