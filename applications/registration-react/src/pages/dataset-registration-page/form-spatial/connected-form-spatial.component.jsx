import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { ConfiguredFormSpatial } from './configured-form-spatial';

const formatTemporalUnixDatesToISO = values => {
  let temporals = null;
  if (values && values.length > 0) {
    temporals = values.map(item => ({
      startDate: _.get(item, 'startDate')
        ? moment(_.get(item, 'startDate')).format('YYYY-MM-DD')
        : null,
      endDate: _.get(item, 'endDate')
        ? moment(_.get(item, 'endDate')).format('YYYY-MM-DD')
        : null
    }));
  }
  return temporals;
};

const mapStateToProps = (state, ownProps) => {
  const { datasetItem } = ownProps;
  return {
    initialValues: {
      spatial:
        _.get(datasetItem, 'spatial', []).length > 0
          ? _.get(datasetItem, 'spatial')
          : [],
      temporal: formatTemporalUnixDatesToISO(
        _.get(datasetItem, 'temporal')
      ) || [{}],
      issued: _.get(datasetItem, 'issued')
        ? moment(_.get(datasetItem, 'issued')).format('YYYY-MM-DD')
        : null,
      language:
        _.get(datasetItem, 'language', []).length > 0
          ? _.get(datasetItem, 'language')
          : []
    }
  };
};

export const ConnectedFormSpatial = connect(mapStateToProps)(
  ConfiguredFormSpatial
);
