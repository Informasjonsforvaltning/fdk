import React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';

import ResultsTabs from '../search-results-tabs';


export default class ResultsConcepts extends React.Component {
  constructor(props) {
    super(props);
    this.queryObj = qs.parse(window.location.search.substr(1));
  }

  render() {
    return (
      <div>
        <ResultsTabs onSelectView={this.props.onSelectView} />
      </div>
    );
  }
}

ResultsConcepts.defaultProps = {
};

ResultsConcepts.propTypes = {
  onSelectView: PropTypes.func.isRequired
};
