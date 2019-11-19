import { connect } from 'react-redux';

import { ConfiguredFormPublisher } from './configured-form-publisher';

const mapStateToProps = (state, { datasetItem = {} }) => ({
  initialValues: {
    publisher: datasetItem.publisher || {}
  }
});

export const ConnectedFormPublisher = connect(mapStateToProps)(
  ConfiguredFormPublisher
);
