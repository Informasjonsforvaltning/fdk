import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import ResultsDataset from '../../components/search-results-dataset';
import ResultsConcepts from '../../components/search-concepts-results';
import './index.scss';
import '../../components/search-results-searchbox/index.scss';

const qs = require('qs');
const sa = require('superagent');

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDatasets: true,
      showConcepts: false
    }
    this.queryObj = qs.parse(window.location.search.substr(1));
    if (!window.themes) {
      window.themes = [];

      sa.get('/reference-data/themes')
        .end((err, res) => {
          if (!err && res) {
            res.body.forEach((hit) => {
              const obj = {};
              obj[hit.code] = {};
              obj[hit.code].nb = hit.title.nb;
              obj[hit.code].nn = hit.title.nb;
              obj[hit.code].en = hit.title.en;
              window.themes.push(obj);
            });
          }
        });
    }
    this.handleSelectView = this.handleSelectView.bind(this)
  }

  handleSelectView(chosenView) {
    if (chosenView === 'datasets') {
      this.setState({
        showDatasets: true,
        showConcepts: false
      });
    } else if (chosenView === 'concepts') {
      this.setState({
        showDatasets: false,
        showConcepts: true
      });
    }
  }

  render() {
    const showDatasets = cx(
      {
        show: this.state.showDatasets,
        hide: !this.state.showDatasets
      }
    );
    const showConcepts = cx(
      {
        show: this.state.showConcepts,
        hide: !this.state.showConcepts
      }
    );
    return (
      <div>
        <div className={showDatasets}>
          <ResultsDataset
            onSelectView={this.handleSelectView}
            isSelected={this.state.showDatasets}
            selectedLanguageCode={this.props.selectedLanguageCode}
          />
        </div>

        <div className={showConcepts}>
          <ResultsConcepts
            onSelectView={this.handleSelectView}            
            isSelected={this.state.showConcepts}
            selectedLanguageCode={this.props.selectedLanguageCode}
          />
        </div>
      </div>
    );
  }
}

SearchPage.defaultProps = {
  selectedLanguageCode: null
};

SearchPage.propTypes = {
  selectedLanguageCode: PropTypes.string
};
