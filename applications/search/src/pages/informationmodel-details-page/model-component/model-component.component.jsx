import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Collapse } from 'reactstrap';
import { withStateHandlers } from 'recompose';
import Scroll from 'react-scroll';

import {
  getOwnProperties,
  getParentTypeRef,
  getTypeFromTypeRef
} from '../../../lib/informationmodel/informationmodel';
import { ModelComponentProperty } from './model-component-property/model-component-property.component';
import './model-component.scss';

const ScrollLink = Scroll.Link;

const renderProperties = properties => {
  if (!properties) {
    return null;
  }

  return Object.keys(properties).map(key => {
    const { type, typeRef, oneOfTypeRefs } = properties[key];

    return (
      <ModelComponentProperty
        key={key}
        name={key}
        type={type}
        typeRef={typeRef}
        oneOfTypeRefs={oneOfTypeRefs}
      />
    );
  });
};

const renderName = (collapseIconClass, onToggle, name, propertiesIsEmpty) => {
  if (propertiesIsEmpty) {
    return (
      <div
        style={{ marginLeft: '16px' }}
        className="d-flex align-items-center w-50"
        name={name}
      >
        <span className="d-flex w-50 fdk-text-extra-strong">{name}</span>
      </div>
    );
  }
  return (
    <button
      type="button"
      style={{ marginRight: '16px' }}
      className="bg-transparent border-0 p-0 d-flex align-items-center w-50 node"
      onClick={onToggle}
      name={name}
    >
      <div className="d-flex align-items-center">
        <i className={collapseIconClass} />
        <span className="d-flex w-50 fdk-text-extra-strong">{name}</span>
      </div>
    </button>
  );
};

const renderType = (type, nativeType) => {
  if (type) {
    return (
      <div className="d-flex w-50">
        <ScrollLink
          key={type}
          to={type}
          spy
          smooth
          isDynamic
          offset={-10}
          duration={1500}
          tabIndex="0"
          className="node"
        >
          <span>{type}</span>
        </ScrollLink>
      </div>
    );
  }
  if (!type && nativeType) {
    return <div className="d-flex w-50">{nativeType}</div>;
  }
  return null;
};

export const ModelComponentPure = props => {
  const { name, definitions, collapse, onToggle } = props;

  if (!definitions) {
    return null;
  }

  const definition = definitions[name];
  const type = getTypeFromTypeRef(getParentTypeRef(definition));
  const nativeType = getTypeFromTypeRef(definition.type);
  const properties = getOwnProperties(definition);
  const propertiesIsEmpty = _.isEmpty(getOwnProperties(definition), true);

  const collapseIconClass = cx(
    'fa',
    'font-weight-bold',
    'mr-2',
    'fdk-color-link',
    {
      'fa-angle-down': !collapse,
      'fa-angle-up': collapse
    }
  );

  return (
    <>
      <div className="d-flex">
        {renderName(collapseIconClass, onToggle, name, propertiesIsEmpty)}

        {renderType(type, nativeType)}
      </div>
      <Collapse className="mt-2" isOpen={collapse}>
        {renderProperties(properties)}
      </Collapse>
    </>
  );
};

ModelComponentPure.defaultProps = {
  name: null,
  definitions: null
};

ModelComponentPure.propTypes = {
  name: PropTypes.string,
  definitions: PropTypes.object
};

const enhance = withStateHandlers(
  ({ initialCollapse = false }) => ({
    collapse: initialCollapse
  }),
  {
    onToggle: ({ collapse }) => () => ({ collapse: !collapse })
  }
);

export const ModelComponentWithState = enhance(ModelComponentPure);
export const ModelComponent = ModelComponentWithState;
