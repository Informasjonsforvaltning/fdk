import { getFormSyncErrors, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { compose } from 'recompose';
import { resolve } from 'react-resolver';

import { FormRelatedDatasetsPure } from './form-related-datasets-pure';
import { asyncValidate } from '../async-patch/async-patch';
import {
  extractDatasets,
  searchDatasets
} from '../../../services/api/search-api/datasets';
import { extractApis, searchApis } from '../../../services/api/search-api/apis';

export const getApiByHarvestSourceUri = harvestSourceUri =>
  searchApis({ harvestSourceUri, returnFields: 'id' })
    .then(extractApis)
    .catch(() => []);

const memoizedGetApiByHarvestSourceUri = _.memoize(getApiByHarvestSourceUri);

const getDatasetsByReferenceToApiId = id =>
  searchDatasets({
    distributionAccessServiceEndpointDescriptionUri: id,
    returnFields: 'id,title,publisher'
  }).then(extractDatasets);
const memoizedGetDatasetsByReferenceToApiId = _.memoize(
  getDatasetsByReferenceToApiId
);

const mapStateToProps = ({ form }, ownProps) => {
  const { apiItem } = ownProps;
  return {
    syncErrors: getFormSyncErrors('apiDatasetReferences')(form),
    initialValues: {
      datasetUris: _.get(apiItem, 'datasetUris', [])
    }
  };
};

const enhance = compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'apiDatasetReferences',
    asyncValidate
  }),
  resolve({
    referencingDatasets: async ({ apiItem }) => {
      // todo The problem is that we don't have true identifier of the api registration in the api search system.
      // The only trace back to the registration id is the harvest source uri. This is hard-coded uri that is
      // working in all environments in cluster for local api  registration system.
      // We are waiting for DCAT-no 2.0 so that harvesting process could be more standardised
      const harvestSourceUri = `http://fdk-nginx-search:8080/api/registration/apis/${apiItem.id}`;
      const harvestedApis = await memoizedGetApiByHarvestSourceUri(
        harvestSourceUri
      );
      if (harvestedApis.length !== 1) {
        return [];
      }
      const harvestedApi = harvestedApis[0];
      return memoizedGetDatasetsByReferenceToApiId(harvestedApi.id);
    }
  })
);

export const FormRelatedDatasets = enhance(FormRelatedDatasetsPure);
