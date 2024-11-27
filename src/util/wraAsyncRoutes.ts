import { Router } from "express";
import { asyncErrorHandler } from "./asyncErrorHandler";

export const wrapAsyncRoutes = (router: Router) => {
    // console.log(router.stack)
  router.stack.forEach((layer: any) => {
    if (layer.route) {
      layer.route.stack.forEach((routeHandler: any) => {
        // console.log(routeHandler.handle);
        
        routeHandler.handle = asyncErrorHandler(routeHandler.handle);
        // console.log(routeHandler.handle);
        
      });
    }
  });
};
