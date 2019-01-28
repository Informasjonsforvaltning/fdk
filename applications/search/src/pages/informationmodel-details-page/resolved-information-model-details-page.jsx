import _ from 'lodash';
import { resolve } from 'react-resolver';
import { InformationModelDetailsPage } from './information-model-details-page';
import { getInformationmodel } from '../../api/informationmodels';

const memoizedGetInformationModel = _.memoize(getInformationmodel);

const mapProps = {
  informationModelItem: props =>
    memoizedGetInformationModel(props.match.params.id)
};

export const ResolvedInformationModelDetailsPage = resolve(mapProps)(
  InformationModelDetailsPage
);
