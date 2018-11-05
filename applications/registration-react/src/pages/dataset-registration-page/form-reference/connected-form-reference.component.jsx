import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ConfiguredFormTitle } from './configured-form-reference';
import { languageType } from '../../../schemaTypes';

const mapStateToProps = (state, ownProps) => {
  const { datasetItem, referenceTypesItems, referenceDatasetsItems } = ownProps;
  return {
    initialValues: {
      references:
        _.get(datasetItem, 'references', []).length > 0
          ? _.get(datasetItem, 'references')
          : [languageType],
      referenceTypesItems,
      referenceDatasetsItems
    },
    syncErrors: getFormSyncErrors('reference')(state)
  };
};

export const ConnectedFormReference = connect(mapStateToProps)(
  ConfiguredFormTitle
);
