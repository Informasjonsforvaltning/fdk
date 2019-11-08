import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import includes from 'lodash/includes';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import InputField from '../../../components/fields/field-input/field-input.component';
import MultilingualField from '../../../components/multilingual-field/multilingual-field.component';
import RadioField from '../../../components/fields/field-radio/field-radio.component';
import { legalBasisType } from '../../../schemaTypes';
import { datasetFormPatchThunk } from '../formsLib/asyncValidateDatasetInvokePatch';
import { AlertMessage } from '../../../components/alert-message/alert-message.component';
import {isNapPublish, isNapUnPublishAccessRights} from "../../../lib/napPublish";

/*
 Resets fields when radio button "Offentlig" is chosen.
 */
const resetFields = props => {
  props.change('legalBasisForRestriction', [legalBasisType]);
  props.change('legalBasisForProcessing', [legalBasisType]);
  props.change('legalBasisForAccess', [legalBasisType]);
};

export const renderLegalBasisFields = ({
  item,
  index,
  fields,
  titleLabel,
  linkLabel,
  onDeleteFieldAtIndex,
  languages
}) => (
  <div className="d-flex flex-column mb-2" key={index}>
    <MultilingualField
      name={`${item}.prefLabel`}
      component={InputField}
      label={titleLabel}
      showLabel
      languages={languages}
    />
    <div className="mt-2">
      <Field
        name={`${item}.uri`}
        component={InputField}
        label={linkLabel}
        showLabel
      />
    </div>
    <div className="d-flex align-items-end">
      <button
        className="fdk-btn-no-border"
        type="button"
        title="Remove legal basis"
        onClick={() => onDeleteFieldAtIndex(fields, index)}
      >
        <i className="fa fa-trash mr-2" />
      </button>
    </div>
  </div>
);
renderLegalBasisFields.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
  titleLabel: PropTypes.string.isRequired,
  linkLabel: PropTypes.string.isRequired,
  onDeleteFieldAtIndex: PropTypes.func.isRequired,
  languages: PropTypes.array.isRequired
};

export const renderLegalBasis = ({
  fields,
  titleLabel,
  linkLabel,
  onDeleteFieldAtIndex,
  languages
}) => {
  return (
    <div>
      {fields &&
        fields.map((item, index) =>
          renderLegalBasisFields({
            item,
            index,
            fields,
            titleLabel,
            linkLabel,
            onDeleteFieldAtIndex,
            languages
          })
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
renderLegalBasis.propTypes = {
  fields: PropTypes.object.isRequired,
  titleLabel: PropTypes.string.isRequired,
  linkLabel: PropTypes.string.isRequired,
  onDeleteFieldAtIndex: PropTypes.func.isRequired,
  languages: PropTypes.array.isRequired
};
export const FormAccessRights = props => {
  const {
    syncErrors,
    hasAccessRightsURI,
    dispatch,
    catalogId,
    datasetId,
    languages,
    datasetFormStatus,
    datasetItem
  } = props;
  const accessRight = syncErrors ? syncErrors.accessRight : null;
  const deleteFieldAtIndex = (fields, index) => {
    const values = fields.getAll();
    // use splice instead of skip, for changing the bound value
    values.splice(index, 1);
    const patch = { [fields.name]: values };
    const thunk = datasetFormPatchThunk({ catalogId, datasetId, patch });
    dispatch(thunk);
  };
  return (
    <form>
      <div className="form-group">
        <Helptext
          title={localization.schema.accessRights.heading}
          term="Dataset_accessRights"
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

        {datasetFormStatus &&
        includes(datasetFormStatus.lastChangedFields, 'accessRights')
        && isNapPublish(datasetItem)
        && (
          <AlertMessage type="info">
            <span>{localization.formStatus.napPublish}</span>
          </AlertMessage>
        )}

        {datasetFormStatus &&
        includes(datasetFormStatus.lastChangedFields, 'accessRights')
        && isNapUnPublishAccessRights(datasetItem)
        && (
          <AlertMessage type="info">
            <span>{localization.formStatus.napUnPublish}</span>
          </AlertMessage>
        )}

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
                term="Dataset_legalBasisForRestriction"
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
                onDeleteFieldAtIndex={deleteFieldAtIndex}
                languages={languages}
              />
            </div>

            <div className="form-group">
              <Helptext
                title={
                  localization.schema.accessRights.legalBasisForProcessing
                    .heading
                }
                term="Dataset_legalBasisForProcessing"
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
                onDeleteFieldAtIndex={deleteFieldAtIndex}
                languages={languages}
              />
            </div>

            <div className="form-group">
              <Helptext
                title={
                  localization.schema.accessRights.legalBasisForAccess.heading
                }
                term="Dataset_legalBasisForAccess"
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
                onDeleteFieldAtIndex={deleteFieldAtIndex}
                languages={languages}
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
  datasetId: null,
  languages: [],
  datasetFormStatus: null,
  datasetItem: null
};
FormAccessRights.propTypes = {
  syncErrors: PropTypes.object,
  hasAccessRightsURI: PropTypes.string,
  dispatch: PropTypes.func,
  catalogId: PropTypes.string,
  datasetId: PropTypes.string,
  languages: PropTypes.array,
  datasetFormStatus: PropTypes.object,
  datasetItem: PropTypes.object
};
