import authentication from '../middleware/authentication';
import { createDocument, getAllDocument, updateDocument, getDocumentByUserId,
    getDocumentByRole, deleteDocument } from '../controllers/documents';

const Routes = (apiRoutes) => {
  apiRoutes
  .post('/documents', authentication.verifyToken, createDocument)
  .get('/documents', authentication.verifyToken, getAllDocument)
  .put('/documents/:id', authentication.verifyToken, updateDocument)
  .delete('/documents/:id', authentication.verifyToken, deleteDocument)
  .get('/documents/users/:id', authentication.verifyToken, getDocumentByUserId)
  .get('/documents/roles/:id', authentication.verifyToken, getDocumentByRole);
};

export default Routes;
