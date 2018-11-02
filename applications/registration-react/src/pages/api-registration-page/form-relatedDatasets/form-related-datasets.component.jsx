import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Field } from 'redux-form';
import localization from '../../../utils/localization';
import Helptext from '../../../components/helptext/helptext.component';
import { InputTagsDatasetsField } from '../field-tagsinput-datasets/field-tagsinput-datasets.components';

export const FormRelatedDatasets = ({
  helptextItems,
  orgPath,
  referencedDatasets
}) => (
  <form>
    <div className="form-group">
      <Helptext
        title={
          localization.schema.apiDatasetReferences.helptext.datasetReferences
        }
        helptextItems={_.get(helptextItems, 'Cost')}
      />
      <Field
        name="datasetReferences"
        type="text"
        component={InputTagsDatasetsField}
        label="datasetReferences"
        fieldLabel={localization.getLanguage()}
        orgPath={orgPath}
        referencedDatasets={referencedDatasets}
      />
    </div>
  </form>
);

FormRelatedDatasets.defaultProps = {
  helptextItems: null,
  orgPath: null,
  referencedDatasets: null
};

FormRelatedDatasets.propTypes = {
  helptextItems: PropTypes.object,
  orgPath: PropTypes.string,
  referencedDatasets: PropTypes.array
};
