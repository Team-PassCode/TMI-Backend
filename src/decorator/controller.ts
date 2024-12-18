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
  };
}
