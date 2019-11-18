import { resolve } from 'react-resolver';
import { memoizedGetOrganizationList } from '../../../../api/organization-api/host';

const mapProps = {
  suggestions: memoizedGetOrganizationList
};

export const searchPublisherResolver = resolve(mapProps);
