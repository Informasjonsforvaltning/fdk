import { resolve } from 'react-resolver';
import { memoizedGetOrganizationList } from '../../../../services/api/organization-api/host';

const mapProps = {
  suggestions: memoizedGetOrganizationList
};

export const searchPublisherResolver = resolve(mapProps);
