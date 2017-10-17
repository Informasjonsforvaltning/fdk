import * as React from 'react';
import PropTypes from 'prop-types';

import localization from '../../components/localization';

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.loadDatasetFromServer();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <h1 className="fdk-margin-bottom">
              {localization.about.title}
            </h1>
            <div className="fdk-margin-bottom">
              <p className="fdk-ingress">
                {localization.about.ingress}
              </p>
            </div>
            <div className="fdk-textregular">
              <p>
                {localization.about.maintext}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

About.defaultProps = {
  selectedLanguageCode: null
};

About.propTypes = {
  selectedLanguageCode: PropTypes.string
};

