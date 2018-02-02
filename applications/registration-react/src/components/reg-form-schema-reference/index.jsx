import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux'

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import SelectField from '../reg-form-field-select';
import asyncValidate from '../../utils/asyncValidate';


const validate = values => {
  const errors = {}
  const spatial = (values.spatial && values.spatial.uri) ? values.spatial.uri : null;
  if (spatial && spatial.length < 2) {
    errors.spatial = { uri: localization.validation.minTwoChars}
  }
  return errors
}

const renderReferenceFields = (item, index, fields, props, referenceTypesItems, referenceDatasetsItems) => (
  <div className="d-flex" key={index}>
    <div className="w-50">
      <Field
        name={`${item}.referenceType`}
        component={SelectField}
        items={referenceTypesItems}
      />
    </div>
    <div className="w-50">
      <Field
        name={`${item}.source`}
        component={SelectField}
        items={referenceDatasetsItems}
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
            asyncValidate(fields.getAll(), null, props, `remove_references_${index}`);
          }
        }
      >
        <i className="fa fa-trash mr-2" />
      </button>
    </div>
  </div>
);

const renderReference = (props) => {
  const { fields, referenceTypesItems, referenceDatasetsItems } = props;
  return (
    <div>
      {fields && fields.map((item, index) =>
        renderReferenceFields(item, index, fields, props, referenceTypesItems, referenceDatasetsItems)
      )}
      <button type="button" onClick={() => fields.push({})}>
        <i className="fa fa-plus mr-2" />
        Legg til relaterte datasett
      </button>
    </div>
  );
};

let FormReference = props => {
  const { helptextItems, initialValues } = props;
  const { referenceTypesItems, referenceDatasetsItems } = initialValues;
  if (initialValues ) {
    return (
      <form>
        <div className="form-group">
          <Helptext title="Relasjoner" helptextItems={helptextItems.Dataset_relation} />
          <FieldArray
            name="references"
            component={renderReference}
            referenceTypesItems={referenceTypesItems}
            referenceDatasetsItems={referenceDatasetsItems}
          />
        </div>
      </form>
    )
  } return null;
}

FormReference = reduxForm({
  form: 'reference',
  validate,
  asyncValidate,
})(FormReference)

const mapStateToProps = ({ dataset, referenceTypes, referenceDatasets }) => (
  {
    initialValues: {
      references: (dataset.result.references && dataset.result.references.length > 0) ? dataset.result.references : '',
      referenceTypesItems: referenceTypes.referenceTypesItems,
      referenceDatasetsItems: referenceDatasets.referenceDatasetsItems
    }
  }
)

export default connect(mapStateToProps)(FormReference)
