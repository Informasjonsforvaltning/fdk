import _ from 'lodash';
import { resolve } from 'react-resolver';
import { InformationModelDetailsPage } from './information-model-details-page';
import { getInformationModel } from '../../api/get-information-model';

const memoizedGetInformationModel = _.memoize(getInformationModel);

const mapProps = {
  informationModelItem: props =>
    memoizedGetInformationModel(props.match.params.id)
};

export const ResolvedInformationModelDetailsPage = resolve(mapProps)(
  InformationModelDetailsPage
);
