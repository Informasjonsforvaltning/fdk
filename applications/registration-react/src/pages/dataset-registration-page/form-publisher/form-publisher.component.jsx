import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import localization from '../../../services/localization';
import { Helptext } from '../../../components/helptext/helptext.component';
import { SearchPublisher } from './search-publisher/search-publisher.component';
import { PublisherField } from './field-publisher/field-publisher.component';
import { getTranslateText } from '../../../services/translateText';

export const FormPublisher = ({ datasetItem }) => {
  const [chosenPublisher, setChosenPublisher] = useState({});
  const { publisher } = datasetItem;

  return (
    <>
      <div className="form-group">
        <div className="mb-5">
          <span>
            {localization.schema.publisher.registerBehalfOf}{' '}
            {getTranslateText(publisher.prefLabel) || publisher.name}
          </span>
        </div>
        <Helptext title={localization.schema.publisher.helptext.title} />
        <label className="fdk-form-label mb-2" htmlFor="publisher">
          {localization.schema.publisher.searchOrgNr}
        </label>
        <div className="d-flex">
          <SearchPublisher onChosenPublisher={setChosenPublisher} />
          <form>
            <Field
              name="publisher"
              component={PublisherField}
              publisher={chosenPublisher}
            />
          </form>
        </div>
      </div>
    </>
  );
};

FormPublisher.defaultProps = {
  datasetItem: null
};

FormPublisher.propTypes = {
  datasetItem: PropTypes.object
};
