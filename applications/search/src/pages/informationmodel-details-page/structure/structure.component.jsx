import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../../lib/localization';
import { ModelComponent } from '../model-component/model-component.component';

const renderModelComponents = definitions =>
  Object.keys(definitions).map((key, index) => (
    <div key={index} className="border-top pt-3 pb-3 d-flex flex-column">
      <ModelComponent name={key} definitions={definitions} />
    </div>
  ));

export const Structure = ({ definitions }) => {
  if (!definitions) {
    return null;
  }

  return (
    <>
      <div
        style={{ marginLeft: '16px' }}
        className="d-flex schema-collapse--item"
      >
        <div className="w-50 pl-0">
          <strong>{localization.name}</strong>
        </div>
        <div className="w-50">
          <strong>{localization.type}</strong>
        </div>
      </div>
      {renderModelComponents(definitions)}
    </>
  );
};

Structure.defaultProps = {
  definitions: null
};

Structure.propTypes = {
  definitions: PropTypes.object
};
