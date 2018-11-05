import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import localization from '../../../utils/localization';
import { textType, emptyArray } from '../../../schemaTypes';
import { ConfiguredFormTitle } from './configured-form-title';

const mapStateToProps = (state, ownProps) => {
  const { datasetItem } = ownProps;
  return {
    initialValues: {
      title:
        _.get(datasetItem, ['title', localization.getLanguage()], []).length > 0
          ? _.get(datasetItem, 'title')
          : textType,
      description:
        _.get(datasetItem, ['description', localization.getLanguage()], [])
          .length > 0
          ? _.get(datasetItem, 'description')
          : textType,
      objective:
        _.get(datasetItem, ['objective', localization.getLanguage()], [])
          .length > 0
          ? _.get(datasetItem, 'objective')
          : textType,
      landingPage: _.get(datasetItem, 'landingPage', emptyArray)
    },
    syncErrors: getFormSyncErrors('title')(state)
  };
};

export const ConnectedFormTitle = connect(mapStateToProps)(ConfiguredFormTitle);
