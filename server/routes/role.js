import auth from '../middleware/authentication';
import { getAllRoles } from '../controllers/role';

const Routes = (apiRoutes) => {
  apiRoutes
  .get('/roles', auth.verifyToken, getAllRoles);
};

export default Routes;
