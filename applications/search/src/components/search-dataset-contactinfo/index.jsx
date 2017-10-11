import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../components/localization';

export default class DatasetContactInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div id="dataset-contactinfo" className="row fdk-row fdk-margin-top-triple">
        {this.props.uri &&
        <div className="col-md-12 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon fdk-padding-no">
              <i className="fa fa-info fdk-detail-icon-oneline" />
            </div>
            <div className="fdk-detail-text">
              <p className="fdk-ingress fdk-margin-bottom-no">
                <a
                  id="dataset-contact-uri"
                  title={localization.dataset.contactPoint.background}
                  href={this.props.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {localization.dataset.contactPoint.background}
                  <i className="fa fa-external-link fdk-fa-right" />
                </a>
              </p>
            </div>
          </div>
        </div>
        }

        {this.props.organizationUnit && this.props.url &&
          <div className="col-md-12 fdk-padding-no">
            <div className="fdk-container-detail">
              <div className="fdk-detail-icon fdk-padding-no">
                <i className="fa fa-address-card fdk-detail-icon-oneline" />
              </div>
              <div className="fdk-detail-text">
                <p className="fdk-ingress fdk-margin-bottom-no">
                  <a
                    id="dataset-contact-url"
                    title={`${localization.dataset.contactPoint.organizationUnit} ${this.props.organizationUnit}`}
                    href={this.props.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {localization.dataset.contactPoint.organizationUnit} {this.props.organizationUnit}
                    <i className="fa fa-external-link fdk-fa-right" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        }

        {this.props.email &&
        <div className="col-md-8 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon fdk-detail-icon-oneline">
              <i className="fa fa-envelope" />
            </div>
            <div className="fdk-detail-text">
              <p className="fdk-ingress fdk-margin-bottom-no">
                <a
                  id="dataset-contact-email"
                  title={this.props.email}
                  href={`mailto:${this.props.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {this.props.email}
                </a>
              </p>
            </div>
          </div>
        </div>
        }

        {this.props.telephone &&
        <div className="col-md-4 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon fdk-detail-icon-oneline">
              <i className="fa fa-phone" />
            </div>
            <div className="fdk-detail-text">
              <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                {this.props.telephone}
              </p>
            </div>
          </div>
        </div>
        }
      </div>
    );
  }
}

DatasetContactInfo.defaultProps = {
  uri: null,
  email: null,
  organizationUnit: null,
  url: null,
  telephone: null
};

DatasetContactInfo.propTypes = {
  uri: PropTypes.string,
  email: PropTypes.string,
  organizationUnit: PropTypes.string,
  url: PropTypes.string,
  telephone: PropTypes.string
};
