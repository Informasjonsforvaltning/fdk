import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Collapse } from 'reactstrap';
import _ from 'lodash';
import { withStateHandlers } from 'recompose';

import { getTranslateText } from '../../lib/translateText';
import localization from '../../lib/localization';
import './helptext.scss';

export const Helptext = props => {
  const {
    title,
    required,
    abstract,
    description,
    helptextItems,
    toggleShowAll,
    showAll
  } = props;

  const collapseClass = cx('fa', 'fdk-fa-left', {
    'fa-angle-double-down': !showAll,
    'fa-angle-double-up': showAll
  });

  const shortdesc = abstract || _.get(helptextItems, 'shortdesc');
  const descriptionText = description || _.get(helptextItems, 'description');

  return (
    <div className="fdk-reg-helptext mb-3 p-3">
      <div className="d-flex align-items-center">
        <h3>{title}</h3>
        {required && (
          <span className="fdk-badge badge badge-secondary ml-2">
            {localization.helptext.required}
          </span>
        )}
      </div>
      <div className="d-md-flex">
        {shortdesc && (
          <p
            className="m-0"
            dangerouslySetInnerHTML={{
              __html: getTranslateText(shortdesc).replace(
                new RegExp('\n', 'g'),
                '<br />'
              )
            }}
          />
        )}
        {descriptionText &&
          getTranslateText(descriptionText).trim() !== '' && (
            <button
              className="fdk-btn-no-border text-left p-0 ml-1 fdk-reg-helptext-more align-self-start"
              onClick={toggleShowAll}
            >
              <i className={collapseClass} />
              {showAll
                ? localization.helptext.less
                : localization.helptext.more}
            </button>
          )}
      </div>
      {descriptionText &&
        getTranslateText(descriptionText).trim() !== '' && (
          <Collapse className="mt-3" isOpen={showAll}>
            <p
              dangerouslySetInnerHTML={{
                __html: getTranslateText(descriptionText).replace(
                  new RegExp('\n', 'g'),
                  '<br />'
                )
              }}
            />
          </Collapse>
        )}
    </div>
  );
};

Helptext.defaultProps = {
  title: '',
  required: false,
  abstract: null,
  description: null,
  helptextItems: null,
  toggleShowAll: _.noop,
  showAll: false
};

Helptext.propTypes = {
  title: PropTypes.string,
  required: PropTypes.bool,
  abstract: PropTypes.string,
  description: PropTypes.string,
  helptextItems: PropTypes.object,
  toggleShowAll: PropTypes.func,
  showAll: PropTypes.bool
};

const enhance = withStateHandlers(
  ({ initialShowAll = false }) => ({
    showAll: initialShowAll
  }),
  {
    toggleShowAll: ({ showAll }) => e => {
      e.preventDefault();
      return { showAll: !showAll };
    }
  }
);

export default enhance(Helptext);
