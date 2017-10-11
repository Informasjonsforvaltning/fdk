import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import localization from '../../components/localization';

export default class DatasetContact extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
        <div>
          <div className="row fdk-row">
            <div className="col-md-12 fdk-padding-no">
                <div className="fdk-container-detail">
                    <div className="fdk-detail-icon">
                        <i className="fa fa-info"></i>
                    </div>
                    <div className="fdk-detail-text">
                        <p className="fdk-ingress fdk-margin-bottom-no">
                          <a href="#">Bakgrunnsinformasjon om datasettet <i className="fa fa-external-link" aria-hidden="true"></i></a>
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-md-12 fdk-padding-no">
                <div className="fdk-container-detail">
                    <div className="fdk-detail-icon">
                        <i className="fa fa-info"></i>
                    </div>
                    <div className="fdk-detail-text">
                        <p className="fdk-ingress fdk-margin-bottom-no">
                          <a href="#">Ta kontakt med avdeling for digitalisering <i className="fa fa-external-link" aria-hidden="true"></i></a>
                        </p>
                    </div>
                </div>
          </div>
        </div>
      </div>
    );
  }
}

DatasetContact.defaultProps = {
  header: '',
  relevans: null,
  kompletthet: null,
  noyaktighet: null,
  tilgjengelighet: null
};

DatasetContact.propTypes = {
  header: PropTypes.string,
  relevans: PropTypes.string,
  kompletthet: PropTypes.string,
  noyaktighet: PropTypes.string,
  tilgjengelighet: PropTypes.string
};
