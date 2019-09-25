import { formValueSelector, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ConfiguredFormAccessRights } from './configured-form-accessRights';
import { accessRights, legalBasisType } from '../../../schemaTypes';

const selector = formValueSelector('accessRights');

const mapStateToProps = (state, ownProps) => {
  const { datasetItem } = ownProps;
  const hasAccessRightsURI = selector(state, 'accessRights.uri');
  return {
    initialValues: {
      accessRights: _.get(datasetItem, 'accessRights', accessRights),
      legalBasisForRestriction:
        _.get(datasetItem, ['legalBasisForRestriction'], []).length > 0
          ? _.get(datasetItem, 'legalBasisForRestriction')
          : [legalBasisType],
      legalBasisForProcessing:
        _.get(datasetItem, ['legalBasisForProcessing'], []).length > 0
          ? _.get(datasetItem, 'legalBasisForProcessing')
          : [legalBasisType],
      legalBasisForAccess:
        _.get(datasetItem, ['legalBasisForAccess'], []).length > 0
          ? _.get(datasetItem, 'legalBasisForAccess')
          : [legalBasisType]
    },
    hasAccessRightsURI,
    syncErrors: getFormSyncErrors('accessRights')(state.form)
  };
};

export const ConnectedFormAccessRights = connect(mapStateToProps)(
  ConfiguredFormAccessRights
);
