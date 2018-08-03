import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import { Button } from 'reactstrap';

import localization from '../../lib/localization';
import { ReportStats } from './report-stats/report-stats.component';
import { PublishersSelect } from './publishers-select/publishers-select.component';
import { PublishersTree } from './publishers-tree/publishers-tree.component';
import { getParamFromLocation } from '../../lib/addOrReplaceUrlParam';

export class DatasetsReportPage extends React.Component {
  constructor(props) {
    super(props);

    this.clearSearch = this.clearSearch.bind(this);
    this.selectPublisher = this.selectPublisher.bind(this);

    this.state = {
      aggregateDataset: {}
    };
    const orgPath = getParamFromLocation(props.location, 'orgPath');
    this.getData(orgPath);
    this.props.fetchPublishersIfNeeded();
  }

  componentDidUpdate(prevProps) {
    const newOrgPath = getParamFromLocation(this.props.location, 'orgPath');
    const prevOrgPath = getParamFromLocation(prevProps.location, 'orgPath');

    if (newOrgPath !== prevOrgPath) {
      this.getData(newOrgPath);
    }
  }

  getData(orgPath) {
    const query = orgPath || '';

    axios
      .get(`/aggregateDataset?q=${query}`)
      .then(response => this.setState({ aggregateDataset: response.data }))
      .catch(error => console.error(error));
  }

  selectPublisher(publisher) {
    const orgPath = publisher && publisher.orgPath;
    const currentSearch = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    const newSearch = { ...currentSearch, orgPath };
    const newSearchStr = qs.stringify(newSearch, {
      addQueryPrefix: true,
      skipNulls: true,
      encode: false
    });

    // This is react-router browserHistory object
    // https://github.com/ReactTraining/history
    this.props.history.push({ search: newSearchStr });
  }

  clearSearch() {
    this.selectPublisher(null);
  }

  render() {
    const orgPath = getParamFromLocation(this.props.location, 'orgPath');
    const selectedPublisher = _.get(this.props.publishers, [orgPath], null);

    return (
      <section className="container">
        <div className="row">
          <div className="col-md-4">
            <Button
              className="fdk-button"
              onClick={this.clearSearch}
              color="primary"
            >
              {localization.query.clear}
            </Button>
            <PublishersSelect
              publishers={this.props.publishers}
              onChange={this.selectPublisher}
              value={selectedPublisher}
            />
            <PublishersTree
              onChange={this.selectPublisher}
              value={selectedPublisher}
            />
          </div>
          <div className="col-md-8">
            <ReportStats
              aggregateDataset={this.state.aggregateDataset}
              entityName={
                (selectedPublisher && selectedPublisher.name) ||
                localization.report.allEntities
              }
            />
          </div>
        </div>
      </section>
    );
  }
}

DatasetsReportPage.defaultProps = {
  fetchPublishersIfNeeded: _.noop
};

DatasetsReportPage.propTypes = {
  fetchPublishersIfNeeded: PropTypes.func,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
