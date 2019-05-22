import { withInjectablesMapper } from '../../../lib/injectables';

export const injector = withInjectablesMapper(injectables => ({
  searchHostname: injectables.config.searchHostname
}));
