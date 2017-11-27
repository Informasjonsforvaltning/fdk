import React from 'react';
import PropTypes from 'prop-types';

import ResultsDatasetsReport from '../../components/search-results-datasets-report';
import './index.scss';
import '../../components/search-results-searchbox/index.scss';

export default class ReportsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <ResultsDatasetsReport
          selectedLanguageCode={this.props.selectedLanguageCode}
        />
        <pre>{JSON.stringify(this.state, null, 2) }</pre>
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
