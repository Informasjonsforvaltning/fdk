import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import localization from '../../../lib/localization';

export const DatasetContactInfo = props => {
  const { contactPoint = null } = props;
  let email;
  let organizationUnit;
  let hasURL;
  let hasTelephone = null;

  if (contactPoint) {
    email = contactPoint.email;
    organizationUnit = contactPoint.organizationUnit;
    hasURL = contactPoint.hasURL;
    hasTelephone = contactPoint.hasTelephone;
  }

  const emailClass = cx('fdk-container-detail', {
    'col-md-8': hasTelephone,
    'col-md-12': !hasTelephone
  });

  const telephoneClass = cx('fdk-container-detail', {
    'col-md-4': email,
    'col-md-12': !email
  });

  return (
    <div className="dataset-contactinfo">
      <div className="row fdk-row">
        {organizationUnit && (
          <div className="col-md-12 fdk-padding-no">
            <div className="fdk-container-detail">
              <div className="fdk-detail-icon fdk-padding-no">
                <i className="fa fa-address-card fdk-detail-icon-oneline" />
              </div>
              <div className="fdk-detail-text">
                <p className="fdk-ingress fdk-margin-bottom-no">
                  {hasURL && (
                    <a
                      className="dataset-contact-url"
                      title={`${localization.dataset.contactPoint
                        .organizationUnit} ${organizationUnit}`}
                      href={hasURL || null}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {localization.dataset.contactPoint.organizationUnit}{' '}
                      {organizationUnit}
                      <i className="fa fa-external-link fdk-fa-right" />
                    </a>
                  )}
                  {!hasURL &&
                    `${localization.dataset.contactPoint
                      .organizationUnit} ${organizationUnit}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="row fdk-row row-eq-height">
        {email && (
          <div className={emailClass}>
            <div className="fdk-detail-icon fdk-detail-icon-oneline">
              <i className="fa fa-envelope" />
            </div>
            <div className="fdk-detail-text">
              <h5>{localization.dataset.contactPoint.email}</h5>
              <p className="fdk-ingress fdk-margin-bottom-no">
                <a
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
        )}

        {hasTelephone && (
          <div className={telephoneClass}>
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
        )}
      </div>
    </div>
  );
};

DatasetContactInfo.defaultProps = {
  contactPoint: null
};

DatasetContactInfo.propTypes = {
  contactPoint: PropTypes.object
};
