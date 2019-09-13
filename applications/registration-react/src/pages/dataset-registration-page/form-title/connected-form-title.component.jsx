import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import localization from '../../../lib/localization';
import { textType, emptyArray } from '../../../schemaTypes';
import { ConfiguredFormTitle } from './configured-form-title';

const mapStateToProps = (state, { datasetItem = {} }) => ({
  initialValues: {
    title: datasetItem.title || {},
    description: datasetItem.description || {},
    objective:
      _.get(datasetItem, ['objective', localization.getLanguage()], []).length >
      0
        ? _.get(datasetItem, 'objective')
        : textType,
    landingPage: _.get(datasetItem, 'landingPage', emptyArray)
  },
  syncErrors: getFormSyncErrors('title')(state)
});

export const ConnectedFormTitle = connect(mapStateToProps)(ConfiguredFormTitle);
