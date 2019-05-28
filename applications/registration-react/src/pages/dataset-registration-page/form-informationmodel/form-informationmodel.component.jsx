import React from 'react';
import { Field, FieldArray } from 'redux-form';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/field-input/field-input.component';

const renderInformationModelFields = (item, index, fields, compopnentProps) => (
  <div className="d-flex mb-5" key={index}>
    <div className="w-50">
      <Field
        name={`${item}.prefLabel.${localization.getLanguage()}`}
        component={InputField}
        label={compopnentProps.titleLabel}
        showLabel
      />
    </div>
    <div className="w-50">
      <Field
        name={`${item}.uri`}
        component={InputField}
        label={compopnentProps.linkLabel}
        showLabel
      />
    </div>
  </div>
);

export const renderInformationModel = compopnentProps => {
  const { fields } = compopnentProps;
  return (
    <div>
      {fields &&
        fields.map((item, index) =>
          renderInformationModelFields(item, index, fields, compopnentProps)
        )}
    </div>
  );
};

export const FormInformationModel = () => (
  <form>
    <div className="form-group">
      {
        <div className="mt-4">
          <div className="form-group">
            <Helptext
              title={
                localization.schema.informationModel.helptext.informationModel
              }
              term="Dataset_informationModel"
            />
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
);
