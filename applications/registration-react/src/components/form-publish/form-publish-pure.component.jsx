import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Field } from 'redux-form';

import { StatusBar } from '../status-bar/status-bar.component';

export const FormPublishPure = ({
  isSaving,
  lastSaved,
  error,
  justPublishedOrUnPublished,
  onDelete,
  allowPublish,
  type
}) => (
  <form>
    <Field
      name="registrationStatus"
      component={({ input }) => (
        <StatusBar
          type={type}
          isSaving={isSaving}
          lastSaved={lastSaved}
          error={error}
          justPublishedOrUnPublished={justPublishedOrUnPublished}
          onDelete={onDelete}
          allowPublish={allowPublish}
          onChange={input.onChange}
          registrationStatus={input.value}
        />
      )}
    />
  </form>
);

FormPublishPure.defaultProps = {
  isSaving: false,
  lastSaved: null,
  error: null,
  justPublishedOrUnPublished: false,
  onDelete: noop,
  allowPublish: true
};

FormPublishPure.propTypes = {
  isSaving: PropTypes.bool,
  lastSaved: PropTypes.string,
  error: PropTypes.object,
  justPublishedOrUnPublished: PropTypes.bool,
  onDelete: PropTypes.func,
  allowPublish: PropTypes.bool,
  type: PropTypes.string.isRequired
};
