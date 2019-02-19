import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import _ from 'lodash';
import localization from '../../../utils/localization';
import Helptext from '../../../components/helptext/helptext.component';
import RadioField from '../../../components/field-radio/field-radio.component';
import './form-access.scss';

export const FormAccess = ({ helptextItems }) => (
  <form>
    <div className="form-group api-access">
      <Helptext
        title={localization.schema.apiAccess.helptext.isOpenAccess}
        helptextItems={_.get(helptextItems, 'isOpenAccess')}
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
    <div className="form-group api-access">
      <Helptext
        title={localization.schema.apiAccess.helptext.isOpenLicense}
        helptextItems={_.get(helptextItems, 'isOpenLicense')}
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
    <div className="form-group api-access">
      <Helptext
        title={localization.schema.apiAccess.helptext.isFree}
        helptextItems={_.get(helptextItems, 'isFree')}
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
    <div className="form-group api-access">
      <Helptext
        title={localization.schema.apiAccess.helptext.nationalComponent}
        helptextItems={_.get(helptextItems, 'nationalComponent')}
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

FormAccess.defaultProps = {
  helptextItems: null
};

FormAccess.propTypes = {
  helptextItems: PropTypes.object
};
