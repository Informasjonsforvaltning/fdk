import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button } from 'reactstrap';

import localization from '../../services/localization';

import './language-picker.styles.scss';

const LanguagePicker = ({ languages, toggleInputLanguage }) => {
  const shouldDisableLanguage = code => {
    const selectedLanguages = languages.filter(({ selected }) => selected);
    return selectedLanguages.length === 1 && selectedLanguages[0].code === code;
  };

  return (
    <div className="language-picker">
      <p>{`${localization.lang.choose}:`}</p>
      <div className="language-button-group">
        {languages.map(({ code, title, selected }) => (
          <Button
            key={code}
            className={cx('fdk-button border-0', {
              'fdk-bg-color-primary-lighter': !selected,
              'fdk-color-link-darker': !selected,
              'no-shadow': selected
            })}
            color={shouldDisableLanguage(code) ? 'secondary' : 'primary'}
            disabled={shouldDisableLanguage(code)}
            onClick={() => toggleInputLanguage(code)}
          >
            {selected && (
              <img src="/img/icon-checked-white-sm.svg" alt="icon" />
            )}
            {title}
          </Button>
        ))}
      </div>
    </div>
  );
};

LanguagePicker.defaultProps = {
  languages: [],
  toggleInputLanguage: () => {}
};

LanguagePicker.propTypes = {
  languages: PropTypes.array,
  toggleInputLanguage: PropTypes.func
};

export default LanguagePicker;
