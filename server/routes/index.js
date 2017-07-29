import documentRoutes from './document';
import userRoutes from './user';
import searchRoutes from './search';

const routes = (router) => {
  userRoutes(router);
  searchRoutes(router);
  documentRoutes(router);
};

export default routes;
