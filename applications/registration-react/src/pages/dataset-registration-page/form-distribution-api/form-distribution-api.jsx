import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import { InputTagsAPIsField } from '../field-tagsinput-apis/field-tagsinput-apis.component';

export const renderDistributionsAPI = componentProps => {
  const { helptextItems } = componentProps;
  return (
    <div className="form-group">
      <Helptext
        title={localization.schema.distributionAPI.helptext.api}
        helptextItems={helptextItems.Dataset_spatial}
      />
      <Field
        name="distribution"
        type="text"
        component={InputTagsAPIsField}
        label={localization.schema.concept.conceptLabel}
        fieldLabel="no"
      />
    </div>
  );
};

export const FormDistributionAPI = props => {
  const { helptextItems } = props;
  return (
    <form>
      <FieldArray
        name="distribution"
        component={renderDistributionsAPI}
        helptextItems={helptextItems}
      />
    </form>
  );
};

FormDistributionAPI.propTypes = {
  helptextItems: PropTypes.object.isRequired
};
