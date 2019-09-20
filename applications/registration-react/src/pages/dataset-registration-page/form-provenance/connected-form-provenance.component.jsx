import { connect } from 'react-redux';
import moment from 'moment';

import { ConfiguredFormProvenance } from './configured-form-provenance';
import { currentnessAnnotationType } from '../../../schemaTypes';

const mapStateToProps = (
  state,
  { datasetItem = {}, frequencyItems, provenanceItems }
) => {
  const {
    provenance = {},
    modified = null,
    hasCurrentnessAnnotation = currentnessAnnotationType,
    accrualPeriodicity
  } = datasetItem;

  return {
    initialValues: {
      frequencyItems,
      provenanceItems,
      provenance,
      modified: modified && moment(modified).format('YYYY-MM-DD'),
      hasCurrentnessAnnotation,
      accrualPeriodicity
    }
  };
};

export const ConnectedFormProvenance = connect(mapStateToProps)(
  ConfiguredFormProvenance
);
