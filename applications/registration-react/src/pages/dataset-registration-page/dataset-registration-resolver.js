import { resolve } from 'react-resolver';
import { memoizedGetOrganization } from '../../api/organization-api/host';

const mapProps = {
  organization: props => memoizedGetOrganization(props.catalogId)
};

export const datasetRegistrationnResolver = resolve(mapProps);
