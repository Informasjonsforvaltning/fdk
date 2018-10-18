import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import _ from 'lodash';
import moment from 'moment';
import Moment from 'react-moment';
import 'moment/locale/nb';

import localization from '../../../utils/localization';
import { ButtonRegistrationStatus } from '../button-registration-status/button-registration-status.component';

export const FormPublish = props => {
  const { lastSaved, apiItem } = props;
  const lastModified = lastSaved || _.get(apiItem, 'lastModified');

  const calendarStrings = {
    lastDay: `[${localization.yesterday} ${localization.time}] LT`,
    sameDay() {
      return `[for ${moment(lastModified).fromNow()}]`;
    },
    lastWeek: `[${localization.at}] dddd [kl.] LT`,
    sameElse: 'DD.MM.YYYY'
  };
  return (
    <form>
      <Field
        name="registrationStatus"
        component={ButtonRegistrationStatus}
        label="Status"
      />

      {lastModified && (
        <span className="ml-3">
          <i className="fa fa-check-circle mr-2" />
          {`${localization.app.lastSaved} `}{' '}
          <Moment
            locale={localization.getLanguage()}
            calendar={calendarStrings}
          >
            {lastModified}
          </Moment>
        </span>
      )}

      <div className="mt-5">
        <strong>{localization.app.notPublished}</strong>
        <div>{localization.app.notPublishedText}</div>
      </div>
    </form>
  );
};

FormPublish.defaultProps = {
  lastSaved: null,
  apiItem: null
};

FormPublish.propTypes = {
  lastSaved: PropTypes.string,
  apiItem: PropTypes.object
};
