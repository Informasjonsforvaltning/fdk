import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import _ from 'lodash';
import localization from '../../../services/localization';
import { Helptext } from '../../../components/helptext/helptext.component';
import { InputTagsDatasetsField } from '../field-tagsinput-datasets/field-tagsinput-datasets.components';
import { getConfig } from '../../../config';
import { getTranslateText } from '../../../services/translateText';

const renderReferecingDatasets = datasets =>
  datasets &&
  datasets.length > 0 && (
    <div className="px-3 mt-5 mb-5">
      <div className="d-flex border-bottom py-3">
        <span className="w-75">
          <strong>{localization.connectedDatasets}</strong>
        </span>
        <span className="w-25">
          <strong>Tilbyder</strong>
        </span>
      </div>
      {datasets.map(item => (
        <div
          key={item.id}
          className="d-flex align-items-center border-bottom py-3"
        >
          <span className="w-75">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${getConfig().searchHost}/datasets/${item.id}`}
            >
              {getTranslateText(item.title)}
            </a>
          </span>
          <span className="w-25 breakword">
            {_.get(item, ['publisher', 'name'])}
          </span>
        </div>
      ))}
    </div>
  );

export const FormRelatedDatasetsPure = ({
  referencedDatasets,
  referencingDatasets
}) => (
  <form>
    <div className="form-group">
      <Helptext
        title={
          localization.schema.apiDatasetReferences.helptext.datasetReferences
        }
        term="Related_dataset"
      />
      <Field
        name="datasetUris"
        type="text"
        component={InputTagsDatasetsField}
        label="datasetReferences"
        fieldLabel={localization.getLanguage()}
        referencedDatasets={referencedDatasets}
      />
    </div>
    {renderReferecingDatasets(referencingDatasets)}
  </form>
);

FormRelatedDatasetsPure.defaultProps = {
  referencedDatasets: [],
  referencingDatasets: []
};

FormRelatedDatasetsPure.propTypes = {
  referencedDatasets: PropTypes.array,
  referencingDatasets: PropTypes.array
};
