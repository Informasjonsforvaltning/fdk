import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import { emptyArray } from '../../../schemaTypes';
import { ConfiguredFormTitle } from './configured-form-title';

const mapStateToProps = (state, { datasetItem = {} }) => ({
  initialValues: {
    title: datasetItem.title || {},
    description: datasetItem.description || {},
    objective: datasetItem.objective || {},
    landingPage: _.get(datasetItem, 'landingPage', emptyArray)
  },
  syncErrors: getFormSyncErrors('title')(state)
});

export const ConnectedFormTitle = connect(mapStateToProps)(ConfiguredFormTitle);
