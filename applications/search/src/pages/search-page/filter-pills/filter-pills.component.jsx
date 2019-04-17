import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';

import localization from '../../../lib/localization';
import { getTranslateText } from '../../../lib/translateText';
import { Pill } from '../../../components/pill/pill.component';
import {
  setMultiselectFilterValue,
  isFilterNotEmpty,
  clearFilters
} from '../search-location-helper';

const getFilterLabel = (key, keyValue, publishers) => {
  if (
    keyValue.toUpperCase() === 'UKJENT' ||
    keyValue.toUpperCase() === 'MISSING'
  ) {
    return localization.unknown;
  }
  if (key === 'orgPath') {
    return (
      getTranslateText(_.get(publishers, [keyValue, 'prefLabel'])) ||
      _.get(publishers, [keyValue, 'name'])
    );
  }
  return localization[keyValue.toLowerCase()] || keyValue;
};

const renderThemePill = ({ themesItems, keyValue, history, location, key }) => {
  const themeArray = keyValue.split(',');
  return themeArray.map((theme, index) => {
    const label = getTranslateText(_.get(themesItems, [theme, 'title']));
    return (
      <Pill
        key={`${keyValue}-${index}`}
        history={history}
        location={location}
        name={key}
        value={theme}
        label={label}
        handleOnClick={() => {
          setMultiselectFilterValue(history, location, key, theme, false);
        }}
      />
    );
  });
};

export const FilterPills = ({
  history,
  location,
  locationSearch,
  themesItems,
  publishers
}) => {
  if (!isFilterNotEmpty(location)) {
    return null;
  }

  const clearButtonClass = cx(
    'btn',
    'fdk-button',
    'fdk-button-black-toggle',
    'border',
    'border-dark',
    'fade-in-500',
    {
      'd-none': !isFilterNotEmpty(location)
    }
  );

  const pills = (history, location, locationSearch, themesItems, publishers) =>
    Object.keys(_.omit(locationSearch, ['q', 'page', 'sortfield'])).map(key => {
      const keyValue = locationSearch[key];
      if (key === 'theme') {
        return renderThemePill({
          themesItems,
          keyValue,
          history,
          location,
          key
        });
      }
      return (
        <Pill
          key={`${key}-${keyValue}`}
          history={history}
          location={location}
          name={key}
          value={keyValue}
          label={getFilterLabel(key, keyValue, publishers)}
          handleOnClick={() => {
            setMultiselectFilterValue(history, location, key, keyValue, false);
          }}
        />
      );
    });

  return (
    <div>
      <h3>{localization.activeFilter}</h3>
      <div className="d-flex flex-wrap mt-4">
        {pills(history, location, locationSearch, themesItems, publishers)}
      </div>

      <div className="mt-2 mb-4">
        <button
          className={clearButtonClass}
          onClick={() => clearFilters(history, location)}
          type="button"
        >
          {localization.query.clear}
        </button>
      </div>
    </div>
  );
};

FilterPills.defaultProps = {
  history: null,
  location: null,
  locationSearch: null,
  themesItems: null,
  publishers: null
};

FilterPills.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  locationSearch: PropTypes.object,
  themesItems: PropTypes.object,
  publishers: PropTypes.object
};
