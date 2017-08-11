import { verifyToken } from '../middleware/authentication';
import { createDocument, getAllDocument, updateDocument, getDocumentByUserId,
    getDocumentByRole, deleteDocument,
    documentById } from '../controllers/documents';

const Routes = (apiRoutes) => {
  apiRoutes
  .post('/documents', verifyToken, createDocument)
  .get('/documents', verifyToken, getAllDocument)
  .get('/documents/:id', verifyToken, documentById)
  .put('/documents/:id', verifyToken, updateDocument)
  .delete('/documents/:id', verifyToken, deleteDocument)
  .get('/users/:id/documents', verifyToken, getDocumentByUserId)
  .get('/roles/:id/documents', verifyToken, getDocumentByRole);
};

export default Routes;
