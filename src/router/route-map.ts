import { asyncRoutes } from './routes';

// export const ROUTE_MAP = {
//   Dashboard: LAYOUT,
//   Analysis: () => import('/@/views/dashboard/analysis/index.vue'),
//   Workbench: () => import('/@/views/dashboard/workbench/index.vue'),
// };

const newRoutes = {};

function generateRouteMap(routes) {
  routes.map((item) => {
    if (item.children && item.children.length > 0) {
      generateRouteMap(item.children);
    }
    newRoutes[item.name] = item.component;
  });
}
generateRouteMap(asyncRoutes);
export const ROUTE_MAP = newRoutes;
