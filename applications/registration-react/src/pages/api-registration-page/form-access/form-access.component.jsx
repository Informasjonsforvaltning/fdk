import React from 'react';
import { Field } from 'redux-form';
import localization from '../../../services/localization';
import { Helptext } from '../../../components/helptext/helptext.component';
import RadioField from '../../../components/fields/field-radio/field-radio.component';
import './form-access.scss';

export const FormAccess = () => (
  <form>
    <div className="form-group mb-5 api-access">
      <Helptext
        title={localization.schema.apiAccess.helptext.isOpenAccess}
        term="isOpenAccess"
      />
      <Field
        name="isOpenAccess"
        radioId="isOpenAccess-yes"
        component={RadioField}
        type="radio"
        value="true"
        label={localization.yes}
      />
      <Field
        name="isOpenAccess"
        radioId="isOpenAccess-no"
        component={RadioField}
        type="radio"
        value="false"
        label={localization.no}
      />
    </div>
    <div className="form-group mb-5 api-access">
      <Helptext
        title={localization.schema.apiAccess.helptext.isOpenLicense}
        term="isOpenLicense"
      />
      <Field
        name="isOpenLicense"
        radioId="isOpenLicense-yes"
        component={RadioField}
        type="radio"
        value="true"
        label={localization.yes}
      />
      <Field
        name="isOpenLicense"
        radioId="isOpenLicense-no"
        component={RadioField}
        type="radio"
        value="false"
        label={localization.no}
      />
    </div>
    <div className="form-group mb-5 api-access">
      <Helptext
        title={localization.schema.apiAccess.helptext.isFree}
        term="isFree"
      />
      <Field
        name="isFree"
        radioId="isFree-yes"
        component={RadioField}
        type="radio"
        value="true"
        label={localization.yes}
      />
      <Field
        name="isFree"
        radioId="isFree-no"
        component={RadioField}
        type="radio"
        value="false"
        label={localization.no}
      />
    </div>
    <div className="form-group mb-5 api-access">
      <Helptext
        title={localization.schema.apiAccess.helptext.nationalComponent}
        term="nationalComponent"
      />
      <Field
        name="nationalComponent"
        radioId="nationalComponent-yes"
        component={RadioField}
        type="radio"
        value="true"
        label={localization.yes}
      />
      <Field
        name="nationalComponent"
        radioId="nationalComponent-no"
        component={RadioField}
        type="radio"
        value="false"
        label={localization.no}
      />
    </div>
  </form>
);
