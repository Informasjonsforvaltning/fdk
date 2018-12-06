import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ConfiguredFormConcept } from './configured-form-concept';

const mapStateToProps = (state, ownProps) => {
  const { datasetItem } = ownProps;
  return {
    initialValues: {
      concepts:
        _.get(datasetItem, 'concepts', []).length > 0
          ? _.get(datasetItem, 'concepts')
          : [],
      keyword:
        _.get(datasetItem, 'keyword', []).length > 0
          ? _.get(datasetItem, 'keyword')
          : []
    },
    syncErrors: getFormSyncErrors('concept')(state)
  };
};

export const ConnectedFormConcept = connect(mapStateToProps)(
  ConfiguredFormConcept
);
