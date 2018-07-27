import { reduxForm, formValueSelector, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _throttle from 'lodash/throttle';

import Form from './form';
import validate from './formValidations';
import asyncValidate from '../../utils/asyncValidate';
import { accessRights, legalBasisType } from '../../schemaTypes';

const selector = formValueSelector('accessRights');

const FormAccessRightsSchema = reduxForm({
  form: 'accessRights',
  validate,
  asyncValidate: _throttle(asyncValidate, 250)
})(
  connect(state => {
    const hasAccessRightsURI = selector(state, 'accessRights.uri');
    return {
      hasAccessRightsURI,
      syncErrors: getFormSyncErrors('accessRights')(state)
    };
  })(Form)
);

const mapStateToProps = ({ dataset }) => ({
  initialValues: {
    accessRights: dataset.result.accessRights
      ? dataset.result.accessRights
      : accessRights,
    legalBasisForRestriction:
      dataset.result.legalBasisForRestriction &&
      dataset.result.legalBasisForRestriction.length > 0
        ? dataset.result.legalBasisForRestriction
        : [legalBasisType],
    legalBasisForProcessing:
      dataset.result.legalBasisForProcessing &&
      dataset.result.legalBasisForProcessing.length > 0
        ? dataset.result.legalBasisForProcessing
        : [legalBasisType],
    legalBasisForAccess:
      dataset.result.legalBasisForAccess &&
      dataset.result.legalBasisForAccess.length > 0
        ? dataset.result.legalBasisForAccess
        : [legalBasisType]
  }
});

const mergeProps = (stateProps, dispatchProps, ownProps) =>
  Object.assign({}, stateProps, dispatchProps, ownProps);

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(FormAccessRightsSchema);
