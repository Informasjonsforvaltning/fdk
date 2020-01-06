import React from 'react';
import { Field, FieldArray } from 'redux-form';
import includes from 'lodash/includes';
import get from 'lodash/get';

import localization from '../../../services/localization';
import { Helptext } from '../../../components/helptext/helptext.component';
import InputField from '../../../components/fields/field-input/field-input.component';
import InputFieldReadonly from '../../../components/fields/field-input-readonly/field-input-readonly.component';
import MultilingualField from '../../../components/multilingual-field/multilingual-field.component';
import LinkReadonlyField from '../../../components/fields/field-link-readonly/field-link-readonly.component';
import RadioField from '../../../components/fields/field-radio/field-radio.component';
import { legalBasisType } from '../../../schemaTypes';
import { datasetFormPatchThunk } from '../formsLib/asyncValidateDatasetInvokePatch';
import { AlertMessage } from '../../../components/alert-message/alert-message.component';
import {
  isNapPublish,
  isNapUnPublishAccessRights
} from '../../../lib/napPublish';

/*
 Resets fields when radio button "Offentlig" is chosen.
 */
const resetFields = change => {
  change('legalBasisForRestriction', [legalBasisType]);
  change('legalBasisForProcessing', [legalBasisType]);
  change('legalBasisForAccess', [legalBasisType]);
};
const getAccessRightLabel = value => {
  switch (value) {
    case 'http://publications.europa.eu/resource/authority/access-right/PUBLIC':
      return get(localization, 'schema.accessRights.publicLabel');
    case 'http://publications.europa.eu/resource/authority/access-right/RESTRICTED':
      return get(localization, 'schema.accessRights.restrictedLabel');
    case 'http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC':
      return get(localization, 'schema.accessRights.nonPublicLabel');
    default:
      return null;
  }
};

interface LegalBasisFieldsProps {
  item: {};
  index: number;
  fields: any;
  titleLabel: string;
  linkLabel: string;
  onDeleteFieldAtIndex: (any, number) => void;
  languages: string[];
  isReadOnly: boolean;
}

export const renderLegalBasisFields = ({
  item,
  index,
  fields,
  titleLabel,
  linkLabel,
  onDeleteFieldAtIndex,
  languages,
  isReadOnly
}: LegalBasisFieldsProps) => (
  <div className="d-flex flex-column mb-5" key={index}>
    <MultilingualField
      name={`${item}.prefLabel`}
      component={isReadOnly ? InputFieldReadonly : InputField}
      label={titleLabel}
      showLabel
      languages={languages}
    />
    <div className="mt-2">
      <Field
        name={`${item}.uri`}
        component={isReadOnly ? LinkReadonlyField : InputField}
        label={linkLabel}
        showLabel
      />
    </div>
    {!isReadOnly && (
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
    )}
  </div>
);

interface LegalBasisProps {
  fields: any;
  titleLabel: string;
  linkLabel: string;
  onDeleteFieldAtIndex: (any, number) => void;
  languages: string[];
  isReadOnly: boolean;
}

export const renderLegalBasis = ({
  fields,
  titleLabel,
  linkLabel,
  onDeleteFieldAtIndex,
  languages,
  isReadOnly
}: LegalBasisProps) => {
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
            languages,
            isReadOnly
          })
        )}
      {!isReadOnly && (
        <button
          className="fdk-btn-no-border"
          type="button"
          onClick={() => fields.push({})}
        >
          <i className="fa fa-plus mr-2" />
          {localization.schema.common.add}
        </button>
      )}
    </div>
  );
};

interface FormAccessRightsProps {
  hasAccessRightsURI: string;
  dispatch: (any) => void;
  catalogId: string;
  datasetId: string;
  languages: {}[];
  datasetFormStatus: { lastChangedFields: string[] };
  datasetItem: { accessRights: { uri: string } };
  losItems: {}[];
  isReadOnly: boolean;
  change: (key: string, value: any) => void;
}

export const FormAccessRights = ({
  hasAccessRightsURI,
  dispatch,
  catalogId,
  datasetId,
  languages = [],
  datasetFormStatus,
  datasetItem,
  losItems,
  isReadOnly,
  change
}: FormAccessRightsProps) => {
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
          required
        />
        {isReadOnly && (
          <div className="pl-3">
            {getAccessRightLabel(get(datasetItem, ['accessRights', 'uri']))}
          </div>
        )}
        {!isReadOnly && (
          <>
            <Field
              name="accessRights.uri"
              radioId="accessRight-public"
              component={RadioField}
              type="radio"
              value="http://publications.europa.eu/resource/authority/access-right/PUBLIC"
              label={localization.schema.accessRights.publicLabel}
              onChange={() => resetFields(change)}
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
          </>
        )}

        {datasetFormStatus &&
          includes(datasetFormStatus.lastChangedFields, 'accessRights') &&
          isNapPublish(losItems, datasetItem) && (
            <AlertMessage type="info">
              <span>{localization.formStatus.napPublish}</span>
            </AlertMessage>
          )}

        {datasetFormStatus &&
          includes(datasetFormStatus.lastChangedFields, 'accessRights') &&
          isNapUnPublishAccessRights(losItems, datasetItem) && (
            <AlertMessage type="info">
              <span>{localization.formStatus.napUnPublish}</span>
            </AlertMessage>
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
                isReadOnly={isReadOnly}
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
                isReadOnly={isReadOnly}
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
                isReadOnly={isReadOnly}
              />
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
