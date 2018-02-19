import React from 'react';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputField from '../reg-form-field-input';
import asyncValidate from '../../utils/asyncValidate';
import { informationModelType } from '../../schemaTypes';
import { validateMinTwoChars, validateURL } from '../../validation/validation';

const validate = values => {
  const errors = {}
  const { informationModel } = values;
  let informationModelNodes = null;
  if (informationModel) {
    informationModelNodes = informationModel.map((item, index) => {
      let itemErrors = {}
      const informationModelPrefLabel = (item.prefLabel && item.prefLabel.nb) ? item.prefLabel.nb : null;
      const informationModelURI = item.uri ? item.uri : null;
      itemErrors = validateMinTwoChars('prefLabel', informationModelPrefLabel, itemErrors);
      itemErrors = validateURL('uri', informationModelURI, itemErrors);
      return itemErrors;
    });
    let showSyncError = false;
    informationModelNodes.map(item => {
      if (JSON.stringify(item) !== '{}') {
        showSyncError = true;
      }
    });
    if (showSyncError) {
      errors.informationModel = informationModelNodes;
    }
  }
  return errors
}

const renderInformationModelFields = (item, index, fields, props) => (
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
  </div>
);

const renderInformationModel = (props) => {
  const { fields } = props;
  return (
    <div>
      {fields && fields.map((item, index) =>
        renderInformationModelFields(item, index, fields, props)
      )}
    </div>
  );
};

let FormInformationModel = (props) => {
  const { helptextItems, hasInformationModelUri } = props;
  return (
    <form>
      <div className="form-group">
        {
          <div className="mt-4">
            <div className="form-group">
              <Helptext title="Informasjonsmodell" helptextItems={helptextItems.Dataset_informationModel} />
              <FieldArray
                name="informationModel"
                component={renderInformationModel}
                titleLabel={localization.schema.informationModel.titleLabel}
                linkLabel={localization.schema.informationModel.linkLabel}
              />
            </div>
          </div>
        }
      </div>
    </form>
  )
}

FormInformationModel = reduxForm({
  form: 'informationModel',
  validate,
  asyncValidate,
  asyncChangeFields: [],
})(FormInformationModel)

// Decorate with connect to read form values
const selector = formValueSelector('informationModel')
FormInformationModel = connect(state => {
  const hasInformationModelUri = selector(state, 'informationModel.uri')
  return {
    hasInformationModelUri,
  }
})(FormInformationModel)

const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      informationModel: (dataset.result.informationModel && dataset.result.informationModel.length > 0) ? dataset.result.informationModel : [informationModelType],
    }
  }
)

export default connect(mapStateToProps)(FormInformationModel)
