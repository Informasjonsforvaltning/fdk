import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Collapse } from 'reactstrap';
import _ from 'lodash';
import { withState, withHandlers, compose } from 'recompose';

import localization from '../../utils/localization';
import './helptext.scss';

export const Helptext = props => {
  const { title, required, helptextItems, onToggle, collapse } = props;

  const collapseClass = cx('fa', 'fdk-fa-left', {
    'fa-angle-double-down': !collapse,
    'fa-angle-double-up': collapse
  });

  const shortTextClass = cx('m-0', {
    'text-ellipsis': !collapse
  });

  const shortdesc = _.get(helptextItems, 'shortdesc', '');
  const description = _.get(helptextItems, 'description', '');

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
            className={shortTextClass}
            dangerouslySetInnerHTML={{
              __html:
                shortdesc && shortdesc.nb
                  ? shortdesc.nb.replace(new RegExp('\n', 'g'), '<br />')
                  : ''
            }}
          />
        )}
        {description && (
          <button
            className="fdk-btn-no-border text-left p-0 ml-1 fdk-reg-helptext-more align-self-start"
            onClick={onToggle}
          >
            <i className={collapseClass} />
            {localization.helptext.more}
          </button>
        )}
      </div>
      <Collapse className="mt-3" isOpen={collapse}>
        <p
          dangerouslySetInnerHTML={{
            __html:
              description && description.nb
                ? description.nb.replace(new RegExp('\n', 'g'), '<br />')
                : ''
          }}
        />
      </Collapse>
    </div>
  );
};

Helptext.defaultProps = {
  title: '',
  required: false,
  helptextItems: null,
  onToggle: _.noop(),
  collapse: false
};

Helptext.propTypes = {
  title: PropTypes.string,
  required: PropTypes.bool,
  helptextItems: PropTypes.object,
  onToggle: PropTypes.func,
  collapse: PropTypes.bool
};

const enhance = compose(
  withState('collapse', 'toggleCollapse', false),
  withHandlers({
    onToggle: props => e => {
      e.preventDefault();
      props.toggleCollapse(!props.collapse);
    }
  })
);

export default enhance(Helptext);
