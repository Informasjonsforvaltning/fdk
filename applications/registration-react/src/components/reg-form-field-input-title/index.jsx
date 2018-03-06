import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

// const InputTitleField  = ({ input, label, type, meta: { touched, error, warning }, showLabel, onToggleTitle }) => (
export default class InputTitleField extends React.Component {
  handleOnBlur() {
    const { onToggleTitle } = this.props;
    onToggleTitle();
  }

  render() {
    const { input, label, type, meta: { touched, error, warning }, showLabel, hideInput, onToggleTitle } = this.props;
    return (
      <div>
        <div className="d-flex align-items-center">
          {hideInput &&
            <div className="w-100">
              <h1>
                <label className="fdk-form-label w-100" htmlFor={input.name}>
                  {showLabel ? label : null}
                  <input id="titleInput" {...input} type={type} className="fdk-text-strong" />
                </label>
              </h1>
            </div>
          }
          {!hideInput &&
          <button className="fdk-edit ml-2 mt-2 nowrap" onClick={(e) => {e.preventDefault(); onToggleTitle();}}>
            <i className="fa fa-pencil mr-2" />
            Rediger tittel
          </button>
          }
        </div>
        {touched && ((error &&
        <div className="alert alert-danger mt-3">{error}</div>) || (warning && <div className="alert alert-warning mt-3">{warning}</div>))
        }
      </div>
    );
  }
}


InputTitleField.defaultProps = {
  showLabel: false
};

InputTitleField.propTypes = {
  showLabel: PropTypes.bool
};

