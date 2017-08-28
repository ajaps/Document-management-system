import { verifyToken, adminPass } from '../middleware/authentication';
import { searchUser, searchDocument } from '../controllers/search';

const SearchRoutes = (apiRoutes) => {
  apiRoutes
  .get('/search/users', verifyToken, adminPass, searchUser)
  .get('/search/documents', verifyToken, searchDocument);
};

export default SearchRoutes;
