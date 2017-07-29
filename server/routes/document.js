import authentication from '../middleware/authentication';
import { createDocument, getAllDocument, updateDocument,
 getDocumentByUserId, getDocumentByRole } from '../controllers/documents';

const Routes = (apiRoutes) => {
  apiRoutes
  .post('/documents', authentication.verifyToken, createDocument)
  .get('/documents', authentication.verifyToken, getAllDocument)
  .put('/documents/:id', authentication.verifyToken, updateDocument)
  .get('/documents/users/:id', authentication.verifyToken, getDocumentByUserId)
  .get('/documents/role/:id', authentication.verifyToken, getDocumentByRole);
};

export default Routes;
