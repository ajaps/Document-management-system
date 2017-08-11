import { verifyToken } from '../middleware/authentication';
import { searchUser, searchDocument } from '../controllers/search';

const Routes = (apiRoutes) => {
  apiRoutes
  .get('/search/users', verifyToken, searchUser)
  .get('/search/documents', verifyToken, searchDocument);
};

export default Routes;
