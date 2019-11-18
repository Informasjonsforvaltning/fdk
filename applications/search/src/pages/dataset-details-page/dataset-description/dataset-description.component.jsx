import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';

import localization from '../../../lib/localization';
import { ShowMore } from '../../../components/show-more/show-more';
import { SearchHitHeader } from '../../../components/search-hit-header/search-hit-header.component';
import { getTranslateText } from '../../../lib/translateText';

export class DatasetDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAll: false
    };
    this.toggleShowAll = this.toggleShowAll.bind(this);
  }

  toggleShowAll() {
    const { showAll } = this.state;
    this.setState({ showAll: !showAll });
  }

  render() {
    const { datasetItem, referenceData } = this.props;
    const { publisher, theme, provenance, catalog } = datasetItem || {};
    let { title, descriptionFormatted, objective } = datasetItem || {};
    title = getTranslateText(title);
    descriptionFormatted = getTranslateText(descriptionFormatted);
    objective = getTranslateText(objective);

    return (
      <header>
        <SearchHitHeader
          title={title}
          publisherLabel={localization.search_hit.owned}
          publisher={publisher}
          catalog={catalog}
          theme={theme}
          nationalComponent={_.get(provenance, 'code') === 'NASJONAL'}
          referenceData={referenceData}
          darkThemeBackground
        />

        {descriptionFormatted && (
          <ShowMore showMoreButtonText={localization.showFullDescription}>
            <span
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(descriptionFormatted)
              }}
            />
          </ShowMore>
        )}

        {objective && (
          <ShowMore showMoreButtonText={localization.showFullObjective}>
            <strong>{localization.objective}: </strong>
            {objective}
          </ShowMore>
        )}
      </header>
    );
  }
}

DatasetDescription.defaultProps = {
  datasetItem: null,
  referenceData: null
};

DatasetDescription.propTypes = {
  datasetItem: PropTypes.object,
  referenceData: PropTypes.object
};
