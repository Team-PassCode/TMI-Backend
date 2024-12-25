import { Router } from 'express';
import { Container } from 'typedi';
import { getMetadataArgsStorage } from './getMetadata';

export const registerControllers = (router: Router) => {
  const registerControllers =
    Reflect.getMetadata('registered_controllers', Reflect) || [];

  registerControllers.forEach((ControllerClass: any) => {
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
