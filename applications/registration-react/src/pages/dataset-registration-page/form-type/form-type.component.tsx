import React from 'react';
import { Field } from 'redux-form';
import _ from 'lodash';

import localization from '../../../services/localization';
import Helptext from '../../../components/helptext/helptext.component';
import CheckBoxFieldType from './field-checkbox-type/field-checkbox.component';
import { typeValues } from '../dataset-registration-page.logic';

interface Props {
  syncErrors: any;
  type: any;
  isReadOnly: boolean;
}

export const FormType = (props: Props) => {
  const { syncErrors, isReadOnly, type } = props;
  return (
    <form>
      <div className="form-group">
        <Helptext
          title={localization.schema.type.helptext.type}
          term="Dataset_type"
        />
        {!isReadOnly && <Field name="type" component={CheckBoxFieldType} />}
        {isReadOnly && <div className="pl-3">{typeValues(type.values)}</div>}
        {_.get(syncErrors, 'errorType') && (
          <div className="alert alert-danger mt-3">
            {_.get(syncErrors, 'errorType')}
          </div>
        )}
      </div>
    </form>
  );
};
