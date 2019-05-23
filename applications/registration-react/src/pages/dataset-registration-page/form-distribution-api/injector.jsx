import { withInjectablesMapper } from '../../../lib/injectables';

export const injector = withInjectablesMapper(injectables => ({
  searchHost: injectables.config.searchHost
}));
