import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import ResultsDatasetsReport from '../../components/search-results-datasets-report';
import ResultsConcepts from '../../components/search-concepts-results';
import './index.scss';
import '../../components/search-results-searchbox/index.scss';

const qs = require('qs');
const sa = require('superagent');

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
