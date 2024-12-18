import { Router } from 'express';
import { Container } from 'typedi';
import { getMetadataArgsStorage } from './getMetadata';

export const registerControllers = (router: Router, controllers: any[]) => {
  controllers.forEach((ControllerClass) => {
    const instance: InstanceType<typeof ControllerClass> =
      Container.get(ControllerClass);
    const metadataStorage = getMetadataArgsStorage();
    const controllerMetadata = metadataStorage.controllers.find(
      (controller) => controller.target === ControllerClass
    );

    if (controllerMetadata) {
      const { baseRoute } = controllerMetadata;
      instance.SetRouter(router, baseRoute);
    }
  });
};
