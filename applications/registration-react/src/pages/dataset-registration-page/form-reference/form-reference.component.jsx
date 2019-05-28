import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import _ from 'lodash';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import SelectField from '../../../components/field-select/field-select.component';
import { handleDatasetDeleteFieldPatch } from '../formsLib/formHandlerDatasetPatch';

const renderReferenceFields = (
  item,
  index,
  fields,
  componentProps,
  referenceTypesItems,
  referenceDatasetsItems
) => (
  <div className="d-flex mb-2" key={index}>
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
        labelKey="title"
      />
    </div>
    <div className="d-flex align-items-end">
      <button
        className="fdk-btn-no-border"
        type="button"
        title="Remove reference"
        onClick={() => {
          handleDatasetDeleteFieldPatch(
            _.get(componentProps, 'catalogId'),
            _.get(componentProps, 'datasetId'),
            'references',
            fields,
            index,
            componentProps.dispatch
          );
        }}
      >
        <i className="fa fa-trash mr-2" />
      </button>
    </div>
  </div>
);

export const renderReference = componentProps => {
  const {
    fields,
    referenceTypesItems,
    referenceDatasetsItems
  } = componentProps;
  return (
    <div>
      {fields &&
        fields.map((item, index) =>
          renderReferenceFields(
            item,
            index,
            fields,
            componentProps,
            referenceTypesItems,
            referenceDatasetsItems
          )
        )}
      <button
        className="fdk-btn-no-border"
        type="button"
        onClick={() => fields.push({})}
      >
        <i className="fa fa-plus mr-2" />
        {localization.schema.reference.addReferenceLabel}
      </button>
    </div>
  );
};

export const FormReference = props => {
  const { initialValues, dispatch, catalogId, datasetId } = props;
  const { referenceTypesItems, referenceDatasetsItems } = initialValues;
  if (initialValues) {
    return (
      <form>
        <div className="form-group">
          <Helptext
            title={localization.schema.reference.helptext.reference}
            terms="Dataset_relation"
          />
          <FieldArray
            name="references"
            component={renderReference}
            referenceTypesItems={referenceTypesItems}
            referenceDatasetsItems={referenceDatasetsItems}
            dispatch={dispatch}
            catalogId={catalogId}
            datasetId={datasetId}
          />
        </div>
      </form>
    );
  }
  return null;
};

FormReference.defaultProps = {
  initialValues: null,
  dispatch: null,
  catalogId: null,
  datasetId: null
};

FormReference.propTypes = {
  initialValues: PropTypes.object,
  dispatch: PropTypes.func,
  catalogId: PropTypes.string,
  datasetId: PropTypes.string
};
