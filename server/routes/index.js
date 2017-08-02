import documentRoutes from './document';
import userRoutes from './user';
import searchRoutes from './search';
import roleRoutes from './role';

const routes = (router) => {
  userRoutes(router);
  searchRoutes(router);
  documentRoutes(router);
  roleRoutes(router);
};

export default routes;
