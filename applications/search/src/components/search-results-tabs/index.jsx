import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const ResultsTabs  = (props) => (
  <div className="row">
    <div className="col-md-12 text-center">
      <ul className="search-results-tabs">
        <li><button onClick={() => {props.onSelectView('datasets')}}>Datasett</button></li>
        <li><button onClick={() => {props.onSelectView('concepts')}}>Begrep</button></li>
      </ul>
    </div>
  </div>
)

ResultsTabs.propTypes = {
  onSelectView: PropTypes.func.isRequired
};

export default ResultsTabs;
