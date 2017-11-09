import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';


export default class ResultsTabs extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12 text-center">
          <ul className="search-results-tabs">
            <li className={(!this.props.isSelected)? 'li-active' : ''}>
              <button 
                onClick={() => {this.props.onSelectView('datasets')}}>
                Datasett
              </button>
            </li>
            <li className={(this.props.isSelected)? 'li-active' : ''}>
              <button onClick={() => {this.props.onSelectView('concepts')}}>
                Begrep
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }



}

ResultsTabs.propTypes = {
  onSelectView: PropTypes.func.isRequired,
  isSelected: PropTypes.bool
};