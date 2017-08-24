import DocRoutes from './document';
import RoleRoutes from './role';
import SearchRoutes from './search';
import UserRoutes from './user';
// import notFound from './notFound';

const routes = (router) => {
  UserRoutes(router);
  SearchRoutes(router);
  DocRoutes(router);
  RoleRoutes(router);
};

export default routes;
