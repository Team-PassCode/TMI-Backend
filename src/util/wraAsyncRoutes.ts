import { Router } from "express";
import { asyncErrorHandler } from "./asyncErrorHandler";

export const wrapAsyncRoutes = (router: Router) => {
  router.stack.forEach((layer: any) => {
    if (layer.route) {
      layer.route.stack.forEach((routeHandler: any) => {
        routeHandler.handle = asyncErrorHandler(routeHandler.handle);
      });
    }
  });
};
