import { resolve } from 'react-resolver';
import { memoizedGetOrganization } from '../../services/api/organization-api/host';

const mapProps = {
  allowDelegatedRegistration: props =>
    memoizedGetOrganization(props.catalogId)
      .then(o => o.allowDelegatedRegistration)
      .catch(() => false)
};

export const datasetRegistrationnResolver = resolve(mapProps);
