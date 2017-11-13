import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const ResultsTabs  = (props) => {
  const { onSelectView, isSelected } = props;
  return (
    <div className="row">
      <div className="col-md-12 text-center">
        <ul className="search-results-tabs">
          <li className={(!isSelected) ? 'li-active' : ''}>
            <button
              onClick={() => {
                onSelectView('datasets')
              }}
            >
              Datasett
            </button>
          </li>
          <li className={(isSelected) ? 'li-active' : ''}>
            <button onClick={() => {
              onSelectView('concepts')
            }}
            >
              Begrep
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

ResultsTabs.defaultProps = {
  isSelected: false
};

ResultsTabs.propTypes = {
  onSelectView: PropTypes.func.isRequired,
  isSelected: PropTypes.bool
};

export default ResultsTabs;
