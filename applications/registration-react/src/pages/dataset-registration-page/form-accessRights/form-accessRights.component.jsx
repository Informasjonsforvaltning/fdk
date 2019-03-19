import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import _ from 'lodash';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/field-input/field-input.component';
import RadioField from '../../../components/field-radio/field-radio.component';
import { handleDatasetDeleteFieldPatch } from '../formsLib/formHandlerDatasetPatch';
import { legalBasisType } from '../../../schemaTypes';

/*
 Resets fields when radio button "Offentlig" is chosen.
 */
const resetFields = props => {
  props.change('legalBasisForRestriction', [legalBasisType]);
  props.change('legalBasisForProcessing', [legalBasisType]);
  props.change('legalBasisForAccess', [legalBasisType]);
};

export const renderLegalBasisFields = (item, index, fields, customProps) => (
  <div className="d-flex mb-2" key={index}>
    <div className="w-50">
      <Field
        name={`${item}.prefLabel.${localization.getLanguage()}`}
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
        title="Remove legal basis"
        onClick={() => {
          handleDatasetDeleteFieldPatch(
            _.get(customProps, 'catalogId'),
            _.get(customProps, 'datasetId'),
            fields.name,
            fields,
            index,
            customProps.dispatch
          );
        }}
      >
        <i className="fa fa-trash mr-2" />
      </button>
    </div>
  </div>
);

export const renderLegalBasis = customProps => {
  const { fields } = customProps;
  return (
    <div>
      {fields &&
        fields.map((item, index) =>
          renderLegalBasisFields(item, index, fields, customProps)
        )}
      <button
        className="fdk-btn-no-border"
        type="button"
        onClick={() => fields.push({})}
      >
        <i className="fa fa-plus mr-2" />
        {localization.schema.common.add}
      </button>
    </div>
  );
};

export const FormAccessRights = props => {
  const {
    syncErrors,
    helptextItems,
    hasAccessRightsURI,
    dispatch,
    catalogId,
    datasetId
  } = props;
  const accessRight = syncErrors ? syncErrors.accessRight : null;

  return (
    <form>
      <div className="form-group">
        <Helptext
          title={localization.schema.accessRights.heading}
          helptextItems={helptextItems.Dataset_accessRights}
        />
        <Field
          name="accessRights.uri"
          radioId="accessRight-public"
          component={RadioField}
          type="radio"
          value="http://publications.europa.eu/resource/authority/access-right/PUBLIC"
          label={localization.schema.accessRights.publicLabel}
          onChange={() => resetFields(props)}
        />
        <Field
          name="accessRights.uri"
          radioId="accessRight-restricted"
          component={RadioField}
          type="radio"
          value="http://publications.europa.eu/resource/authority/access-right/RESTRICTED"
          label={localization.schema.accessRights.restrictedLabel}
        />
        <Field
          name="accessRights.uri"
          radioId="accessRight-non_public"
          component={RadioField}
          type="radio"
          value="http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC"
          label={localization.schema.accessRights.nonPublicLabel}
        />

        {accessRight && (
          <div className="alert alert-danger mt-3">
            {accessRight[localization.getLanguage()]}
          </div>
        )}

        {(hasAccessRightsURI ===
          'http://publications.europa.eu/resource/authority/access-right/RESTRICTED' ||
          hasAccessRightsURI ===
            'http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC') && (
          <div className="mt-4">
            <div className="form-group">
              <Helptext
                title={
                  localization.schema.accessRights.legalBasisForRestriction
                    .heading
                }
                helptextItems={helptextItems.Dataset_legalBasisForRestriction}
              />
              <FieldArray
                name="legalBasisForRestriction"
                component={renderLegalBasis}
                titleLabel={
                  localization.schema.accessRights.legalBasisForRestriction
                    .titleLabel
                }
                linkLabel={
                  localization.schema.accessRights.legalBasisForRestriction
                    .linkLabel
                }
                dispatch={dispatch}
                catalogId={catalogId}
                datasetId={datasetId}
              />
            </div>

            <div className="form-group">
              <Helptext
                title={
                  localization.schema.accessRights.legalBasisForProcessing
                    .heading
                }
                helptextItems={helptextItems.Dataset_legalBasisForProcessing}
              />
              <FieldArray
                name="legalBasisForProcessing"
                component={renderLegalBasis}
                titleLabel={
                  localization.schema.accessRights.legalBasisForProcessing
                    .titleLabel
                }
                linkLabel={
                  localization.schema.accessRights.legalBasisForProcessing
                    .linkLabel
                }
                dispatch={dispatch}
                catalogId={catalogId}
                datasetId={datasetId}
              />
            </div>

            <div className="form-group">
              <Helptext
                title={
                  localization.schema.accessRights.legalBasisForAccess.heading
                }
                helptextItems={helptextItems.Dataset_legalBasisForAccess}
              />
              <FieldArray
                name="legalBasisForAccess"
                component={renderLegalBasis}
                titleLabel={
                  localization.schema.accessRights.legalBasisForAccess
                    .titleLabel
                }
                linkLabel={
                  localization.schema.accessRights.legalBasisForAccess.linkLabel
                }
                dispatch={dispatch}
                catalogId={catalogId}
                datasetId={datasetId}
              />
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

FormAccessRights.defaultProps = {
  syncErrors: null,
  hasAccessRightsURI: null,
  dispatch: null,
  catalogId: null,
  datasetId: null
};
FormAccessRights.propTypes = {
  syncErrors: PropTypes.object,
  helptextItems: PropTypes.object.isRequired,
  hasAccessRightsURI: PropTypes.string,
  dispatch: PropTypes.func,
  catalogId: PropTypes.string,
  datasetId: PropTypes.string
};
