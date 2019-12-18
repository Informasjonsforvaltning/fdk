import React from 'react';
import PropTypes from 'prop-types';

import { getTranslateText } from '../../../../services/translateText';
import { getLosItemsFromInput } from '../field-tree-los/field-tree-los-helper';
import { removeValueFromInputValueArray } from '../form-helper';
import './filter-pills-los.scss';

const renderFilterPills = (input, losItems) => {
  const chosenLosItems = getLosItemsFromInput(input, losItems);
  return (
    chosenLosItems &&
    chosenLosItems.filter(Boolean).map(({ uri, name }, index) => (
      <div key={`filter-${index}-${uri}`}>
        <div
          role="button"
          tabIndex="0"
          className="mr-2 mb-1 fdk-badge badge badge-secondary fdk-text-size-15"
          onClick={() => removeValueFromInputValueArray(input, uri)}
          onKeyPress={e => {
            removeValueFromInputValueArray(input, uri);
            e.preventDefault();
          }}
        >
          <span className="fdk-filter-pill">{getTranslateText(name)}</span>
        </div>
      </div>
    ))
  );
};

export const FilterPillsLos = props => {
  const { losItems, input } = props;
  return (
    <div className="d-flex flex-wrap my-2">
      {renderFilterPills(input, losItems)}
    </div>
  );
};

FilterPillsLos.defaultProps = {
  losItems: null
};

FilterPillsLos.propTypes = {
  losItems: PropTypes.array,
  input: PropTypes.object.isRequired
};
