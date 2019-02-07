import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { getTranslateText } from '../../../lib/translateText';

export const InformationModelReference = props => {
  const { informationModelReference } = props;
  if (!informationModelReference) {
    return null;
  }

  const id = _.get(informationModelReference, ['id']);
  const prefLabel = _.get(informationModelReference, ['title']);

  return (
    <div className="d-flex flex-column list-regular--item mb-4 informationmodel-item">
      <Link to={`/informationModels/${id}`}>
        <strong>{prefLabel ? getTranslateText(prefLabel) : id}</strong>
      </Link>
    </div>
  );
};

InformationModelReference.defaultProps = {
  informationModelReference: null
};

InformationModelReference.propTypes = {
  informationModelReference: PropTypes.object
};
