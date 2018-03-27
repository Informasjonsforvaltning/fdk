import React from 'react';
import PropTypes from 'prop-types';

import ResultsDatasetsReport from '../../components/search-results-datasets-report';
import './index.scss';

export default class ReportsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ResultsDatasetsReport
          selectedLanguageCode={this.props.selectedLanguageCode}
        />
      </div>
    );
  }
}

ReportsPage.defaultProps = {
  selectedLanguageCode: null
};

ReportsPage.propTypes = {
  selectedLanguageCode: PropTypes.string
};
