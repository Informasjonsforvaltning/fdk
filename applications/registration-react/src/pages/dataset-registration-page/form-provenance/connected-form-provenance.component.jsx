import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { ConfiguredFormProvenance } from './configured-form-provenance';
import { currentnessAnnotationType } from '../../../schemaTypes';

const mapStateToProps = (state, ownProps) => {
  const { datasetItem, frequencyItems, provenanceItems } = ownProps;
  return {
    initialValues: {
      frequencyItems,
      provenanceItems,
      provenance: _.get(datasetItem, 'provenance', {}),
      modified: _.get(datasetItem, 'modified')
        ? moment(_.get(datasetItem, 'modified')).format('YYYY-MM-DD')
        : null,
      hasCurrentnessAnnotation: _.get(
        datasetItem,
        'hasCurrentnessAnnotation',
        currentnessAnnotationType
      ),
      accrualPeriodicity: _.get(datasetItem, 'accrualPeriodicity')
    }
  };
};

export const ConnectedFormProvenance = connect(mapStateToProps)(
  ConfiguredFormProvenance
);
