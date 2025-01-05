import { Router } from 'express';
import { Container } from 'typedi';
import { getMetadataArgsStorage } from './getMetadata';

export const registerControllers = (router: Router) => {
  const metadataStorage = getMetadataArgsStorage();

  metadataStorage.controllers.forEach(({ target, baseRoute }) => {
    const instance: InstanceType<typeof target> = Container.get(target);

    if (baseRoute) {
      const baseRouter = Router();
      instance.SetRouter(baseRouter);
      router.use(baseRoute, baseRouter);
    }
  });
};
