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
import { isFilterActive } from './filter-helper';

export function DatasetsReportPage({
  location,
  history,
  fetchPublishersIfNeeded,
  publishers
}) {
  function selectPublisher(publisher) {
    const orgPath = publisher && publisher.orgPath;
    const currentSearch = qs.parse(location.search, {
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
    history.push({ search: newSearchStr });
  }

  function clearSearch() {
    selectPublisher(null);
  }

  fetchPublishersIfNeeded();

  const orgPath = getParamFromLocation(location, 'orgPath');
  const selectedPublisher = _.get(publishers, [orgPath], null);

  return (
    <section className="container">
      <div className="row">
        <div className="col-md-4">
          {isFilterActive({ orgPath }) && (
            <Button
              className="fdk-button fade-in-500"
              onClick={clearSearch}
              color="primary"
            >
              {localization.query.clear}
            </Button>
          )}
          <PublishersSelect
            publishers={publishers}
            onChange={selectPublisher}
            value={selectedPublisher}
          />
          <PublishersTree
            onChange={selectPublisher}
            value={selectedPublisher}
          />
        </div>
        <div className="col-md-8">
          <ResolvedReportStats
            orgPath={selectedPublisher && selectedPublisher.orgPath}
            entityName={selectedPublisher && selectedPublisher.name}
          />
        </div>
      </div>
    </section>
  );
}

DatasetsReportPage.defaultProps = {
  fetchPublishersIfNeeded: _.noop,
  publishers: {}
};

DatasetsReportPage.propTypes = {
  fetchPublishersIfNeeded: PropTypes.func,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  publishers: PropTypes.object
};
