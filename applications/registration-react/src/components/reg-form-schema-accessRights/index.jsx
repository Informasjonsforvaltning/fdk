import React from 'react';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import RadioField from '../reg-form-field-radio';
import asyncValidate from '../../utils/asyncValidate';
import { accessRights, legalBasisType, emptyArray } from '../../schemaTypes';

const validate = values => {
  const errors = {}
  const title = (values.title && values.title.nb) ? values.title.nb : null;
  const description = (values.description && values.description.nb) ? values.description.nb : null;
  const objective = (values.objective && values.objective.nb) ? values.objective.nb : null;
  const landingPage = (values.landingPage && values.landingPage[0]) ? values.landingPage[0] : null;
  if (!title) {
    errors.title = {nb: localization.validation.required}
  } else if (title.length < 2) {
    errors.title = {nb: localization.validation.minTwoChars}
  }
  if (description && description.length < 2) {
    errors.description = {nb: localization.validation.minTwoChars}
  }
  if (objective && objective.length < 2) {
    errors.objective = {nb: localization.validation.minTwoChars}
  }
  if (landingPage && landingPage.length < 2) {
    errors.landingPage = [localization.validation.minTwoChars]
  }
  /*
   else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
   errors.email = 'Invalid email address'
   }
   */
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
  const { helptextItems, hasAccessRightsURI } = props;
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

FormAccessRights = reduxForm({
  form: 'accessRights',
  validate,
  asyncValidate,
})(FormAccessRights)

// Decorate with connect to read form values
const selector = formValueSelector('accessRights')
FormAccessRights = connect(state => {
  const hasAccessRightsURI = selector(state, 'accessRights.uri')
  return {
    hasAccessRightsURI,
  }
})(FormAccessRights)

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
