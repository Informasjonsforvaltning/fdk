import { connect } from 'react-redux';
import { App } from './app';
import { setSearchQuery } from '../redux/modules/search';

const mapStateToProps = ({
  datasets,
  apis,
  concepts,
  settings,
  searchQuery
}) => {
  const { language } = settings || {
    language: null
  };
  const { datasetTotal } = datasets || {
    datasetTotal: null
  };

  const { apiTotal } = apis || {
    apiTotal: null
  };

  const { conceptTotal } = concepts || {
    conceptTotal: null
  };

  return {
    language,
    datasetTotal,
    apiTotal,
    conceptTotal,
    searchQuery
  };
};

const mapDispatchToProps = dispatch => ({
  setSearchQuery: (query, history) => dispatch(setSearchQuery(query, history))
});

export const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
