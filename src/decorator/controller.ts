import 'reflect-metadata';
import { Service } from 'typedi';
import { getMetadataArgsStorage } from '../util/getMetadata';

export function Controller(baseRoute?: string) {
  return function (target: Function) {
    Service()(target);
    const metadataStorage = getMetadataArgsStorage();
    metadataStorage.controllers.push({
      target,
      baseRoute,
    });
    const registerControllers =
      Reflect.getMetadata('registered_controllers', Reflect) || [];
    registerControllers.push(target);
    Reflect.defineMetadata(
      'registered_controllers',
      registerControllers,
      Reflect
    );
  };
}
