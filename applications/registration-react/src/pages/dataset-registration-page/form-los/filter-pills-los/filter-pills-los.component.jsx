import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import getTranslateText from '../../../../lib/translateText';
import { getLosItemsFromInput } from '../field-tree-los/field-tree-los-helper';
import { handleUpdateField } from '../form-helper';
import './filter-pills-los.scss';

const renderFilterPills = (input, losItems) => {
  const chosenLosItems = getLosItemsFromInput(input, losItems);
  return (
    chosenLosItems &&
    chosenLosItems.map((item, index) => {
      if (item !== undefined) {
        let inputRef;
        return (
          <div key={`filter-${index}-${_.get(item, 'uri')}`}>
            {/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */}
            <label
              className="mr-2 mb-1 fdk-badge badge badge-secondary fdk-text-size-15"
              onKeyPress={() => {
                inputRef.click();
              }}
              tabIndex="0"
              role="button"
              htmlFor={_.get(item, 'uri')}
            >
              <input
                className="badge"
                ref={input => {
                  inputRef = input;
                }}
                type="text"
                defaultValue={_.get(item, 'uri')}
                checked={false}
                onClick={e => {
                  handleUpdateField(input, e);
                }}
                label={getTranslateText(_.get(item, 'name'))}
                id={_.get(item, 'uri')}
              />
              <span className="fdk-filter-pill">
                {getTranslateText(_.get(item, 'name'))}
              </span>
            </label>
            {/* eslint-enable jsx-a11y/no-noninteractive-element-to-interactive-role */}
          </div>
        );
      }
      return null;
    })
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
