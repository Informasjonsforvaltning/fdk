import { resolve } from 'react-resolver';
import { memoizedGetOrganization } from '../../services/api/organization-api/host';

const mapProps = {
  organization: props => memoizedGetOrganization(props.catalogId)
};

export const datasetRegistrationnResolver = resolve(mapProps);
