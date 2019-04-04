import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import localization from '../../../lib/localization';
import Helptext from '../../../components/helptext/helptext.component';
import { FieldTreeLos } from '../field-tree-los/field-tree-los.component';

export const FormLOS = ({ losItems }) => {
  if (losItems) {
    return (
      <form>
        <div className="form-group">
          <Helptext title={localization.schema.los.helptext.title} />
          <Field
            name="theme"
            component={FieldTreeLos}
            label={localization.schema.los.title}
            losItems={losItems}
          />
        </div>
      </form>
    );
  }
  return null;
};

FormLOS.defaultProps = {
  losItems: null
};

FormLOS.propTypes = {
  losItems: PropTypes.array
};
