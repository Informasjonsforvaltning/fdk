import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';

import { getTypeFromTypeRef } from '../../../../lib/informationmodel/informationmodel';

const ScrollLink = Scroll.Link;

const createTypeRefScrollLink = typeRef => (
  <ScrollLink
    key={typeRef}
    to={typeRef}
    spy
    smooth
    isDynamic
    offset={-10}
    duration={1500}
    tabIndex="0"
    className="node"
  >
    <span>{typeRef}</span>
  </ScrollLink>
);

export const ModelComponentProperty = props => {
  const { name, type, typeRef, oneOfTypeRefs } = props;

  if (!name) {
    return null;
  }

  const typeArray = [];

  if (oneOfTypeRefs) {
    oneOfTypeRefs.forEach((ref, index) => {
      typeArray.push(createTypeRefScrollLink(getTypeFromTypeRef(ref)));
      if (index < oneOfTypeRefs.length) {
        typeArray.push(' | ');
      }
    });
  } else if (typeRef) {
    typeArray.push(createTypeRefScrollLink(getTypeFromTypeRef(typeRef)));
  } else if (type) {
    typeArray.push(type);
  }

  return (
    <div
      style={{ marginLeft: '16px' }}
      className="d-flex schema-collapse--item"
      name={name}
    >
      <div className="w-50 pl-0">{name}</div>
      <div className="w-50">{typeArray}</div>
    </div>
  );
};

ModelComponentProperty.defaultProps = {
  name: null,
  type: null,
  typeRef: null,
  oneOfTypeRefs: null
};

ModelComponentProperty.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  typeRef: PropTypes.string,
  oneOfTypeRefs: PropTypes.array
};
