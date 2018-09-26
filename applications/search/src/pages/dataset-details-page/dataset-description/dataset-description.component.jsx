import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../../lib/localization';
import { ShowMore } from '../../../components/show-more/show-more';
import { PublisherLabel } from '../../../components/publisher-label/publisher-label.component';
import { HarvestDate } from '../../../components/harvest-date/harvest-date.component';
import { SearchHitHeader } from '../../../components/search-hit-header/search-hit-header.component';

export class DatasetDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAll: false
    };
    this.toggleShowAll = this.toggleShowAll.bind(this);
  }

  toggleShowAll() {
    this.setState({ showAll: !this.state.showAll });
  }

  _renderPublisher() {
    const { publisher } = this.props;

    if (!publisher) {
      return null;
    }
    return (
      <PublisherLabel
        label={localization.search_hit.owned}
        publisherItem={publisher}
      />
    );
  }

  render() {
    const { harvest, title, publisher, themes, provenance } = this.props;
    return (
      <header>
        <div className="fdk-detail-date mb-5">
          <HarvestDate harvest={harvest} />
        </div>

        <SearchHitHeader
          title={title}
          publisherLabel={localization.search_hit.owned}
          publisher={publisher}
          theme={themes}
          provenance={provenance}
        />

        {this.props.description && (
          <ShowMore
            showMoreButtonText={localization.showFullDescription}
            label={localization.description}
            contentHtml={this.props.descriptionFormatted}
          />
        )}

        {this.props.objective && (
          <ShowMore
            showMoreButtonText={localization.showFullObjective}
            label={localization.objective}
            contentHtml={this.props.objective}
          />
        )}
      </header>
    );
  }
}

DatasetDescription.defaultProps = {
  title: '',
  description: '',
  descriptionFormatted: null,
  objective: '',
  publisher: null,
  themes: null,
  harvest: null,
  provenance: null
};

DatasetDescription.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  descriptionFormatted: PropTypes.string,
  objective: PropTypes.string,
  publisher: PropTypes.object,
  themes: PropTypes.array,
  harvest: PropTypes.object,
  provenance: PropTypes.object
};
