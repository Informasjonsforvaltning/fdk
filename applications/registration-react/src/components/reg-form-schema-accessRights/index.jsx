import React from 'react';
import { Field, FieldArray, reduxForm, formValueSelector, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import RadioField from '../reg-form-field-radio';
import asyncValidate from '../../utils/asyncValidate';
import { accessRights, legalBasisType } from '../../schemaTypes';
import { validateRequired, validateMinTwoChars} from '../../validation/validation';

const validate = values => {
  let errors = {}
  const accessRight = (values.accessRights && values.accessRights.uri) ? values.accessRights.uri : null;
  const { legalBasisForRestriction, legalBasisForProcessing, legalBasisForAccess } = values;
  let errorNodes = null;

  errors = validateRequired('accessRight', accessRight, errors);

  if (legalBasisForRestriction) {
    errorNodes = legalBasisForRestriction.map((item, index) => {
      let itemErrors = {}
      const legalBasisForRestrictionPrefLabel = (item.prefLabel && item.prefLabel.nb) ? item.prefLabel.nb : null;
      const legalBasisForRestrictionURI = item.uri ? item.uri : null;

      itemErrors = validateMinTwoChars('prefLabel', legalBasisForRestrictionPrefLabel, itemErrors);
      itemErrors = validateMinTwoChars('uri', legalBasisForRestrictionURI, itemErrors, null, false);

      return itemErrors;
    });
  }
  errors.legalBasisForRestriction = errorNodes;

  if (legalBasisForProcessing) {
    errorNodes = legalBasisForProcessing.map((item, index) => {
      let itemErrors = {}
      const legalBasisForProcessingPrefLabel = (item.prefLabel && item.prefLabel.nb) ? item.prefLabel.nb : null;
      const legalBasisForProcessingURI = item.uri ? item.uri : null;

      itemErrors = validateMinTwoChars('prefLabel', legalBasisForProcessingPrefLabel, itemErrors);
      itemErrors = validateMinTwoChars('uri', legalBasisForProcessingURI, itemErrors, null, false);

      return itemErrors;
    });
  }
  errors.legalBasisForProcessing = errorNodes;

  if (legalBasisForAccess) {
    errorNodes = legalBasisForAccess.map((item, index) => {
      let itemErrors = {}
      const legalBasisForAccessPrefLabel = (item.prefLabel && item.prefLabel.nb) ? item.prefLabel.nb : null;
      const legalBasisForAccessURI = item.uri ? item.uri : null;

      itemErrors = validateMinTwoChars('prefLabel', legalBasisForAccessPrefLabel, itemErrors);
      itemErrors = validateMinTwoChars('uri', legalBasisForAccessURI, itemErrors, null, false);

      return itemErrors;
    });
  }
  errors.legalBasisForAccess = errorNodes;


  return errors
}

const renderLegalBasisFields = (item, index, fields, props) => (
  <div className="d-flex mb-5" key={index}>
    <div className="w-50">
      <Field
        name={`${item}.prefLabel.nb`}
        component={InputField}
        label={props.titleLabel}
        showLabel
      />
    </div>
    <div className="w-50">
      <Field
        name={`${item}.uri`}
        component={InputField}
        label={props.linkLabel}
        showLabel
      />
    </div>
    <div className="d-flex align-items-end">
      <button
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
            asyncValidate(fields.getAll(), props.dispatch, props, `remove_${fields.name}_${index}`);
          }
        }
      >
        <i className="fa fa-trash mr-2" />
      </button>
    </div>
  </div>
);

const renderLegalBasis = (props) => {
  const { fields } = props;
  return (
    <div>
      {fields && fields.map((item, index) =>
        renderLegalBasisFields(item, index, fields, props)
      )}
      <button type="button" onClick={() => fields.push({})}>
        <i className="fa fa-plus mr-2" />
        Legg til
      </button>
    </div>
  );
};

let FormAccessRights = (props) => {
  const { syncErrors: { accessRight }, helptextItems, hasAccessRightsURI } = props;
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
                <Helptext title="Skjermingshjemmel" helptextItems={helptextItems.Dataset_legalBasisForRestriction} />
                <FieldArray
                  name="legalBasisForRestriction"
                  component={renderLegalBasis}
                  titleLabel={localization.schema.accessRights.legalBasisForRestriction.titleLabel}
                  linkLabel={localization.schema.accessRights.legalBasisForRestriction.linkLabel}
                />
              </div>

              <div className="form-group">
                <Helptext title="Skjermingshjemmel" helptextItems={helptextItems.Dataset_legalBasisForProcessing} />
                <FieldArray
                  name="legalBasisForProcessing"
                  component={renderLegalBasis}
                  titleLabel={localization.schema.accessRights.legalBasisForProcessing.titleLabel}
                  linkLabel={localization.schema.accessRights.legalBasisForProcessing.linkLabel}
                />
              </div>

              <div className="form-group">
                <Helptext title="Skjermingshjemmel" helptextItems={helptextItems.Dataset_legalBasisForAccess} />
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

const selector = formValueSelector('accessRights');

FormAccessRights = reduxForm({
  form: 'accessRights',
  validate,
  asyncValidate,
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

export default connect(mapStateToProps)(FormAccessRights)
