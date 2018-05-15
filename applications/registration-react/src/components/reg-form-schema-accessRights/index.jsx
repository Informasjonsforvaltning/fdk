import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, reduxForm, formValueSelector, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import _throttle from 'lodash/throttle';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import RadioField from '../reg-form-field-radio';
import asyncValidate from '../../utils/asyncValidate';
import { accessRights, legalBasisType } from '../../schemaTypes';
import { validateRequired, validateMinTwoChars, validateURL} from '../../validation/validation';

const validate = values => {
  let errors = {}
  const accessRight = (values.accessRights && values.accessRights.uri) ? values.accessRights.uri : null;
  const { legalBasisForRestriction, legalBasisForProcessing, legalBasisForAccess } = values;
  let legalBasisForRestrictionNodes = null;
  let legalBasisForProcessingNodes = null;
  let legalBasisForAccessNodes = null;

  errors = validateRequired('accessRight', accessRight, errors);

  if (legalBasisForRestriction) {
    legalBasisForRestrictionNodes = legalBasisForRestriction.map(item => {
      let itemErrors = {};
      const legalBasisForRestrictionPrefLabel = (item.prefLabel && item.prefLabel.nb) ? item.prefLabel.nb : null;
      const legalBasisForRestrictionURI = item.uri ? item.uri : null;

      itemErrors = validateMinTwoChars('prefLabel', legalBasisForRestrictionPrefLabel, itemErrors);
      itemErrors = validateURL('uri', legalBasisForRestrictionURI, itemErrors);

      return itemErrors;
    });
    let showSyncError = false;
    showSyncError = (legalBasisForRestrictionNodes.filter(item => (item && JSON.stringify(item) !== '{}')).length > 0);
    if (showSyncError) {
      errors.legalBasisForRestriction = legalBasisForRestrictionNodes;
    }
  }

  if (legalBasisForProcessing) {
    legalBasisForProcessingNodes = legalBasisForProcessing.map(item => {
      let itemErrors = {}
      const legalBasisForProcessingPrefLabel = (item.prefLabel && item.prefLabel.nb) ? item.prefLabel.nb : null;
      const legalBasisForProcessingURI = item.uri ? item.uri : null;

      itemErrors = validateMinTwoChars('prefLabel', legalBasisForProcessingPrefLabel, itemErrors);
      itemErrors = validateURL('uri', legalBasisForProcessingURI, itemErrors);

      return itemErrors;
    });
    let showSyncError = false;
    showSyncError = (legalBasisForProcessingNodes.filter(item => (item && JSON.stringify(item) !== '{}')).length > 0);
    if (showSyncError) {
      errors.legalBasisForProcessing = legalBasisForProcessingNodes;
    }
  }

  if (legalBasisForAccess) {
    legalBasisForAccessNodes = legalBasisForAccess.map(item => {
      let itemErrors = {}
      const legalBasisForAccessPrefLabel = (item.prefLabel && item.prefLabel.nb) ? item.prefLabel.nb : null;
      const legalBasisForAccessURI = item.uri ? item.uri : null;

      itemErrors = validateMinTwoChars('prefLabel', legalBasisForAccessPrefLabel, itemErrors);
      itemErrors = validateURL('uri', legalBasisForAccessURI, itemErrors);

      return itemErrors;
    });
    let showSyncError = false;
    showSyncError = (legalBasisForAccessNodes.filter(item => (item && JSON.stringify(item) !== '{}')).length > 0);
    if (showSyncError) {
      errors.legalBasisForAccess = legalBasisForAccessNodes;
    }
  }

  return errors
}

/*
 Resets fields when radio button "Offentlig" is chosen.
 */
const resetFields = (props) => {
  props.change('legalBasisForRestriction', [legalBasisType]);
  props.change('legalBasisForProcessing', [legalBasisType]);
  props.change('legalBasisForAccess', [legalBasisType]);
}

const renderLegalBasisFields = (item, index, fields, customProps) => (
  <div className="d-flex mb-2" key={index}>
    <div className="w-50">
      <Field
        name={`${item}.prefLabel.nb`}
        component={InputField}
        label={customProps.titleLabel}
        showLabel
      />
    </div>
    <div className="w-50">
      <Field
        name={`${item}.uri`}
        component={InputField}
        label={customProps.linkLabel}
        showLabel
      />
    </div>
    <div className="d-flex align-items-end">
      <button
        className="fdk-btn-no-border"
        type="button"
        title="Remove temporal"
        onClick={
          () => {
            if (fields.length === 1) {
              fields.remove(index);
              fields.push({});
            }

            if (fields.length > 1) {
              fields.remove(index);
            }
            asyncValidate(fields.getAll(), customProps.dispatch, customProps, `remove_${fields.name}_${index}`);
          }
        }
      >
        <i className="fa fa-trash mr-2" />
      </button>
    </div>
  </div>
);

const renderLegalBasis = (customProps) => {
  const { fields } = customProps;
  return (
    <div>
      {fields && fields.map((item, index) =>
        renderLegalBasisFields(item, index, fields, customProps)
      )}
      <button className="fdk-btn-no-border" type="button" onClick={() => fields.push({})}>
        <i className="fa fa-plus mr-2" />
        Legg til
      </button>
    </div>
  );
};

export const FormAccessRights = (props) => {
  const { syncErrors, helptextItems, hasAccessRightsURI } = props;
  let accessRight = null;
  if (syncErrors) {
    accessRight = syncErrors.accessRight;
  }
  return (
    <form>
      <div className="form-group">
        <Helptext title="Tilgangsnivå" helptextItems={helptextItems.Dataset_distribution} />
        <Field
          name="accessRights.uri"
          radioId="accessRight-public"
          component={RadioField}
          type="radio"
          value="http://publications.europa.eu/resource/authority/access-right/PUBLIC"
          label="Offentlig"
          onChange={() => resetFields(props)}
        />
        <Field
          name="accessRights.uri"
          radioId="accessRight-restricted"
          component={RadioField}
          type="radio"
          value="http://publications.europa.eu/resource/authority/access-right/RESTRICTED"
          label="Begrenset offentlighet"
        />
        <Field
          name="accessRights.uri"
          radioId="accessRight-non_public"
          component={RadioField}
          type="radio"
          value="http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC"
          label="Unntatt offentlighet"
        />

        {accessRight &&
        <div className="alert alert-danger mt-3">{accessRight.nb}</div>
        }

        {
          (hasAccessRightsURI === 'http://publications.europa.eu/resource/authority/access-right/RESTRICTED' ||
            hasAccessRightsURI === 'http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC'
          ) && (
            <div className="mt-4">
              <div className="form-group">
                <Helptext title={localization.schema.accessRights.legalBasisForRestriction.heading} helptextItems={helptextItems.Dataset_legalBasisForRestriction} />
                <FieldArray
                  name="legalBasisForRestriction"
                  component={renderLegalBasis}
                  titleLabel={localization.schema.accessRights.legalBasisForRestriction.titleLabel}
                  linkLabel={localization.schema.accessRights.legalBasisForRestriction.linkLabel}
                />
              </div>

              <div className="form-group">
                <Helptext title={localization.schema.accessRights.legalBasisForProcessing.heading} helptextItems={helptextItems.Dataset_legalBasisForProcessing} />
                <FieldArray
                  name="legalBasisForProcessing"
                  component={renderLegalBasis}
                  titleLabel={localization.schema.accessRights.legalBasisForProcessing.titleLabel}
                  linkLabel={localization.schema.accessRights.legalBasisForProcessing.linkLabel}
                />
              </div>

              <div className="form-group">
                <Helptext title={localization.schema.accessRights.legalBasisForAccess.heading} helptextItems={helptextItems.Dataset_legalBasisForAccess} />
                <FieldArray
                  name="legalBasisForAccess"
                  component={renderLegalBasis}
                  titleLabel={localization.schema.accessRights.legalBasisForAccess.titleLabel}
                  linkLabel={localization.schema.accessRights.legalBasisForAccess.linkLabel}
                />
              </div>
            </div>
          )}
      </div>
    </form>
  )
}

FormAccessRights.defaultProps = {
  syncErrors: null,
  hasAccessRightsURI: null
};

FormAccessRights.propTypes = {
  syncErrors: PropTypes.object,
  helptextItems: PropTypes.object.isRequired,
  hasAccessRightsURI: PropTypes.string
};

const selector = formValueSelector('accessRights');

let FormAccessRightsSchema = reduxForm({
  form: 'accessRights',
  validate,
  asyncValidate: _throttle(asyncValidate, 250),
})(connect(state => {
  const hasAccessRightsURI = selector(state, 'accessRights.uri')
  return {
    hasAccessRightsURI,
    syncErrors: getFormSyncErrors("accessRights")(state)
  }
})(FormAccessRights));


const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      accessRights: (dataset.result.accessRights) ? dataset.result.accessRights : accessRights,
      legalBasisForRestriction: (dataset.result.legalBasisForRestriction && dataset.result.legalBasisForRestriction.length > 0) ? dataset.result.legalBasisForRestriction : [legalBasisType],
      legalBasisForProcessing: (dataset.result.legalBasisForProcessing && dataset.result.legalBasisForProcessing.length > 0) ? dataset.result.legalBasisForProcessing : [legalBasisType],
      legalBasisForAccess: (dataset.result.legalBasisForAccess && dataset.result.legalBasisForAccess.length > 0) ? dataset.result.legalBasisForAccess : [legalBasisType]
    }
  }
)

export default connect(mapStateToProps)(FormAccessRightsSchema)
