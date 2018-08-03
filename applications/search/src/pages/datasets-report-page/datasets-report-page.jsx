import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { Button } from 'reactstrap';

import localization from '../../lib/localization';
import { PublishersSelect } from './publishers-select/publishers-select.component';
import { PublishersTree } from './publishers-tree/publishers-tree.component';
import { getParamFromLocation } from '../../lib/addOrReplaceUrlParam';
import { ResolvedReportStats } from './report-stats/resolved-report-stats';

export class DatasetsReportPage extends React.Component {
  constructor(props) {
    super(props);

    this.clearSearch = this.clearSearch.bind(this);
    this.selectPublisher = this.selectPublisher.bind(this);

    this.props.fetchPublishersIfNeeded();
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
            <ResolvedReportStats
              orgPath={selectedPublisher && selectedPublisher.orgPath}
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
