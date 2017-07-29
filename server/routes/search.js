import authentication from '../middleware/authentication';
import { searchUser, searchDocument } from '../controllers/search';

const Routes = (apiRoutes) => {
  apiRoutes
  .get('/search/users', authentication.verifyToken, searchUser)
  .get('/search/documents', authentication.verifyToken, searchDocument);
};

export default Routes;
