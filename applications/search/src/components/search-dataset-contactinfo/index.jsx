import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../components/localization';

export default class DatasetContactInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { uri, email, organizationUnit, hasTelephone} = this.props.contactPoint;

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
                  href={uri}
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

        {organizationUnit && uri &&
          <div className="col-md-12 fdk-padding-no">
            <div className="fdk-container-detail">
              <div className="fdk-detail-icon fdk-padding-no">
                <i className="fa fa-address-card fdk-detail-icon-oneline" />
              </div>
              <div className="fdk-detail-text">
                <p className="fdk-ingress fdk-margin-bottom-no">
                  <a
                    id="dataset-contact-url"
                    title={`${localization.dataset.contactPoint.organizationUnit} ${organizationUnit}`}
                    href={uri || null}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {localization.dataset.contactPoint.organizationUnit} {organizationUnit}
                    <i className="fa fa-external-link fdk-fa-right" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        }

        {email &&
        <div className="col-md-8 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon fdk-detail-icon-oneline">
              <i className="fa fa-envelope" />
            </div>
            <div className="fdk-detail-text">
              <h5>{localization.dataset.contactPoint.email}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">
                <a
                  id="dataset-contact-email"
                  title={email}
                  href={`mailto:${email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {email}
                </a>
              </p>
            </div>
          </div>
        </div>
        }

        {hasTelephone &&
        <div className="col-md-4 fdk-padding-no">
          <div className="fdk-container-detail">
            <div className="fdk-detail-icon fdk-detail-icon-oneline">
              <i className="fa fa-phone" />
            </div>
            <div className="fdk-detail-text">
              <h5>{localization.dataset.contactPoint.telephone}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no text-nowrap">
                {hasTelephone}
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
  contactPoint: null
};

DatasetContactInfo.propTypes = {
  contactPoint: PropTypes.object
};
