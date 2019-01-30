import _ from 'lodash';
import { resolve } from 'react-resolver';
import { InformationModelDetailsPage } from './information-model-details-page';
import { getInformationmodel } from '../../api/informationmodels';
import { getApiByHarvestSourceUri } from '../../api/apis';

const memoizedGetInformationModel = _.memoize(getInformationmodel);
const memoizedGetApiByHarvestSourceUri = _.memoize(getApiByHarvestSourceUri);

const mapProps = {
  informationModelItem: props =>
    memoizedGetInformationModel(props.match.params.id),
  referencedApis: async props => {
    const informationModelItem = await memoizedGetInformationModel(
      props.match.params.id
    );

    const harvestSourceUri = _.get(informationModelItem, 'harvestSourceUri');

    return Promise.resolve(memoizedGetApiByHarvestSourceUri(harvestSourceUri));
  }
};

export const ResolvedInformationModelDetailsPage = resolve(mapProps)(
  InformationModelDetailsPage
);
