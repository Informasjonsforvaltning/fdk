import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class DatasetDescription extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const formatClass = cx(
      'fdk-button-format',
      {
        'fdk-button-format-inactive': this.props.inactive,
        'fdk-button-format-active': this.props.active
      }
    );
    return (
      <div className="col-md-8">
        <h1 className="fdk-margin-bottom">{this.props.title}</h1>
        <div className="fdk-margin-bottom">
          Eies av <a>Kartverket</a>
          <a><div className="fdk-label">Forvaltning og offentlig sektor</div></a>
          <a><div className="fdk-label">Miljø</div></a>
        </div>

        <p className="fdk-ingress">
          Datasettet avgrenser område for virkeområdet til lov 6. juni 2009 nr. 35 om naturområder i Oslo og nærliggende kommuner (markaloven) som trådte i kraft 1. september 2009.
          Markalovens virkeområde er fastsatt i forskrift 4. september 2015 nr. 1032 om justering av markagrensen fastlegger markalovens geografiske virkeområde med tilhørende kart.
        </p>
        <p className="fdk-ingress">
          Datasettes formål er nullam quis risus eget urna mollis ornare vel eu leo. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus
          sit amet fermentum. Vestibulum id ligula porta felis euismod semper.
        </p>
      </div>
    );
  }
}

DatasetDescription.defaultProps = {
  title: '',
  description: ''
};

DatasetDescription.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
};
