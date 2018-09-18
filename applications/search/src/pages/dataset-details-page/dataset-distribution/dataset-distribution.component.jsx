import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'reactstrap';
import _ from 'lodash';

import localization from '../../../lib/localization';
import { getDistributionTypeByUri } from '../../../redux/modules/distributionType';
import { getTranslateText } from '../../../lib/translateText';
import { ListRegular } from '../../../components/list-regular/list-regular.component';
import { TwoColRow } from '../../../components/list-regular/twoColRow/twoColRow';
import { LinkExternal } from '../../../components/link-external/link-external.component';
import './dataset-distribution.scss';

const formatItems = format => {
  if (!format) {
    return null;
  }
  return format.map((item, index) => (
    <span key={index}>
      {index > 0 ? ', ' : ''}
      {item}
    </span>
  ));
};

export class DatasetDistribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openCollapse: this.props.defaultopenCollapse
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ openCollapse: !this.state.openCollapse });
  }

  renderType() {
    const { distributionTypeItems } = this.props;
    const { type } = this.props;
    if (!type) {
      return null;
    }
    const distributionType = type => {
      let typeText = null;
      if (type !== 'API' && type !== 'Feed' && type !== 'Nedlastbar fil') {
        const distributionType = getDistributionTypeByUri(
          distributionTypeItems,
          type
        );
        if (distributionType !== null && distributionType.length > 0) {
          typeText = getTranslateText(distributionType[0].prefLabel);
        }
        return typeText;
      }
      return type;
    };

    return (
      <TwoColRow
        col1={localization.dataset.distribution.type}
        col2={distributionType(type)}
      />
    );
  }

  renderFormats() {
    const { format } = this.props;

    if (!format || format.length === 0) {
      return null;
    }

    return (
      <TwoColRow
        col1={localization.dataset.distribution.format}
        col2={formatItems(format)}
      />
    );
  }

  renderTilgangsURL() {
    const { accessUrl } = this.props;
    const children = items =>
      items.map(item => (
        <LinkExternal key={item} uri={item} prefLabel={item} />
      ));
    if (!accessUrl) {
      return null;
    }
    return (
      <TwoColRow
        col1={localization.dataset.distribution.accessUrl}
        col2={children(accessUrl)}
      />
    );
  }

  renderLicense() {
    const { license } = this.props;
    const licenseLink = license => (
      <LinkExternal
        uri={_.get(license, 'uri')}
        prefLabel={getTranslateText(_.get(license, 'prefLabel'))}
      />
    );
    if (!license) {
      return null;
    }
    return (
      <TwoColRow
        col1={localization.dataset.distribution.license}
        col2={licenseLink(license)}
      />
    );
  }

  renderConformsTo() {
    const { conformsTo } = this.props;

    const children = items =>
      items.map(item => (
        <LinkExternal
          key={_.get(item, 'uri')}
          uri={_.get(item, 'uri')}
          prefLabel={getTranslateText(_.get(item, 'prefLabel'))}
        />
      ));

    if (!conformsTo) {
      return null;
    }
    return (
      <TwoColRow
        col1={localization.dataset.distribution.conformsTo}
        col2={children(conformsTo)}
      />
    );
  }

  renderDistributionPage() {
    const { page } = this.props;
    const children = items =>
      items.map(page => {
        if (_.get(page, 'uri')) {
          return (
            <LinkExternal
              key={_.get(page, 'uri')}
              uri={_.get(page, 'uri')}
              prefLabel={localization.dataset.distribution.page}
            />
          );
        }
        return null;
      });

    if (!page) {
      return null;
    }

    return (
      <div className="row list-regular--item">
        <div className="col-12 pl-0">{children(page)}</div>
      </div>
    );
  }

  render() {
    const { description, format } = this.props;
    const { openCollapse } = this.state;
    return (
      <section className="fdk-distribution-item mb-1">
        <ListRegular bottomMargin={false}>
          <button className="w-100 p-0" onClick={this.toggle}>
            {format && (
              <div className="row list-regular--item text-left">
                <div className="col-4 pl-0">
                  <span>
                    <strong>{localization.dataset.distribution.format}</strong>
                  </span>
                </div>
                <div className="col-8">{formatItems(format)}</div>
                <i
                  className={`fa fdk-color-blue-dark ${
                    openCollapse ? 'fa-chevron-up' : 'fa-chevron-down'
                  }`}
                />
              </div>
            )}
            {description && (
              <div
                className={`row list-regular--item text-left mb-2 ${
                  !openCollapse ? 'closedCollapse' : ''
                }`}
              >
                <div className="col-4 pl-0 fdk-text-strong">
                  {localization.description}
                </div>
                <div
                  className={`col-8 ${
                    !openCollapse && description.length > 150
                      ? 'show-more__cropped-box'
                      : ''
                  }`}
                >
                  {description}
                </div>
              </div>
            )}
          </button>

          <Collapse isOpen={openCollapse}>
            {this.renderType()}
            {this.renderTilgangsURL()}
            {this.renderLicense()}
            {this.renderConformsTo()}
            {this.renderDistributionPage()}
          </Collapse>
        </ListRegular>
      </section>
    );
  }
}

DatasetDistribution.defaultProps = {
  description: null,
  accessUrl: null,
  format: null,
  license: null,
  conformsTo: null,
  page: null,
  type: null,
  distributionTypeItems: null,
  defaultopenCollapse: false
};

DatasetDistribution.propTypes = {
  description: PropTypes.string,
  accessUrl: PropTypes.array,
  format: PropTypes.array,
  license: PropTypes.object,
  conformsTo: PropTypes.array,
  page: PropTypes.array,
  type: PropTypes.string,
  distributionTypeItems: PropTypes.array,
  defaultopenCollapse: PropTypes.bool
};
