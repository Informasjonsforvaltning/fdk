import _ from 'lodash';
import { resolve } from 'react-resolver';
import { APIRegistrationPage } from './api-registration-page';
import { getPublisherByOrgNr } from '../../api/get-publisher-by-orgnr';
import { getDatasetByURI } from '../../api/get-dataset';

const memoizedGetPublisherByOrgNr = _.memoize(getPublisherByOrgNr);
const memoizedGetDatasetByURI = _.memoize(getDatasetByURI);

const mapProps = {
  publisher: props =>
    memoizedGetPublisherByOrgNr(_.get(props.match, ['params', 'catalogId'])),
  referencedDatasets: async props => {
    const urlArray = _.get(props.item, 'datasetReferences', []).map(
      item => item
    );
    const promiseMap = urlArray.map(url =>
      memoizedGetDatasetByURI(encodeURIComponent(url))
    );
    const result = await Promise.all(promiseMap);
    return result;
  }
};

export const ResolvedAPIRegistrationPage = resolve(mapProps)(
  APIRegistrationPage
);
