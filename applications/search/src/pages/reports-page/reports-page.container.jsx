import React from 'react';
import PropTypes from 'prop-types';

import { ResultsDatasetsReport } from './results-datasets-report/results-datasets-report.component';

export class ReportsPage extends React.Component {
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
