import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Collapse } from 'reactstrap';
import { withStateHandlers } from 'recompose';

import './schema-collapse.scss';

export const SchemaCollapsePure = props => {
  const { title, type, marginLeft, nestLevel, onToggle, collapse } = props;

  if (!(title || type)) {
    return null;
  }

  const collapseIconClass = cx(
    'fa',
    'font-weight-bold',
    'mr-2',
    'fdk-color-blue-dark',
    {
      'fa-angle-down': !collapse,
      'fa-angle-up': collapse
    }
  );

  return (
    <React.Fragment>
      {nestLevel === 1 && (
        <React.Fragment>
          <button
            style={{ marginLeft }}
            className="bg-transparent border-0 p-0 w-100"
            onClick={onToggle}
            name={title}
          >
            <div className="d-flex align-items-center">
              <div className="d-flex justify-content-start w-50">
                <i className={collapseIconClass} />
                <span className="fdk-text-extra-strong">{title}</span>
              </div>
              <span className="d-flex w-50">{type}</span>
            </div>
          </button>
          <Collapse className="mt-2" isOpen={collapse}>
            {props.children}
          </Collapse>
        </React.Fragment>
      )}
      {nestLevel > 1 && (
        <React.Fragment>
          <div style={{ marginLeft }} className="d-flex schema-collapse--item">
            <span className="w-50">{title}</span>
            <span className="w-50">{type}</span>
          </div>
          {props.children}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

SchemaCollapsePure.defaultProps = {
  title: null,
  type: null,
  marginLeft: null,
  nestLevel: null,
  children: null,
  onToggle: _.noop()
};

SchemaCollapsePure.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  marginLeft: PropTypes.number,
  nestLevel: PropTypes.number,
  children: PropTypes.array,
  onToggle: PropTypes.func
};

const enhance = withStateHandlers(
  ({ initialCollapse = true }) => ({
    collapse: initialCollapse
  }),
  {
    onToggle: ({ collapse }) => () => ({ collapse: !collapse })
  }
);

export const SchemaCollapseWithState = enhance(SchemaCollapsePure);
export const SchemaCollapse = SchemaCollapseWithState;
