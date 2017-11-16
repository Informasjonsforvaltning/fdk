import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { browserHistory } from 'react-router';
import qs from 'qs';

import { addOrReplaceParam, getParamFromUrl } from '../../utils/addOrReplaceUrlParam';
import ResultsDataset from '../../components/search-results-dataset';
import ResultsConcepts from '../../components/search-concepts-results';
import './index.scss';
import '../../components/search-results-searchbox/index.scss';

const sa = require('superagent');

const getTabUrl = (tab) => {
  const href = window.location.search;
  const queryObj = qs.parse(window.location.search.substr(1));
  if (href.indexOf('tab=') === -1) {
    return href.indexOf('?') === -1 ? `${href}?tab=${tab}` : `${href}&tab=${tab}`;
  } else if (tab !== queryObj.tab) {
    const replacedUrl = addOrReplaceParam(href, 'tab', tab);
    return replacedUrl.substring(replacedUrl.indexOf('?'));
  }
  return href;
}

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.handleSelectView = this.handleSelectView.bind(this);
    this.handleHistoryListen = this.handleHistoryListen.bind(this);
  }

  componentWillMount() {
    const tabCode = getParamFromUrl('tab');
    if (tabCode !== null) {
      if (tabCode === 'datasets') {
        this.setState({
          showConcepts: false
        });
      } else if (tabCode === 'concepts') {
        this.setState({
          showConcepts: true
        });
      }
    }
  }

  handleSelectView(chosenView) {
    const tabUrl = getTabUrl(chosenView);
    const nextUrl = `${location.pathname}${tabUrl}`;
    browserHistory.push(nextUrl);

    if (chosenView === 'datasets') {
      this.setState({
        showConcepts: false
      });
    } else if (chosenView === 'concepts') {
      this.setState({
        showConcepts: true
      });
    }
  }

  handleHistoryListen(history, location) {
    if(location.search.indexOf('lang=') === -1 && this.props.selectedLanguageCode && this.props.selectedLanguageCode !== "nb") {
      let nextUrl = "";
      if (location.search.indexOf('?') === -1) {
        nextUrl = `${location.search  }?lang=${   this.props.selectedLanguageCode}`
      } else {
        nextUrl = `${location.search  }&lang=${   this.props.selectedLanguageCode}`
      }
      history.push(nextUrl);
    }
  }

  render() {
    const showDatasets = cx(
      {
        show: !this.state.showConcepts,
        hide: this.state.showConcepts
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
            onHistoryListen={this.handleHistoryListen}
            onSelectView={this.handleSelectView}
            selectedLanguageCode={this.props.selectedLanguageCode}
          />
        </div>

        <div className={showConcepts}>
          <ResultsConcepts
            onSelectView={this.handleSelectView}
            isSelected={this.state.showConcepts}
            onHistoryListen={this.handleHistoryListen}
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
