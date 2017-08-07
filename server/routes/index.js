import documentRoutes from './document';
import roleRoutes from './role';
import searchRoutes from './search';
import userRoutes from './user';

const routes = (router) => {
  userRoutes(router);
  searchRoutes(router);
  documentRoutes(router);
  roleRoutes(router);
};

export default routes;
